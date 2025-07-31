import { HttpService } from '@nestjs/axios';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CategoriesService } from 'src/categories/categories.service';
import { isEqual } from 'lodash';


@Injectable()
export class MoviesService {
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {
    this.baseUrl = this.config.get<string>('BASE_URL')!;
    this.username = this.config.get<string>('XTREAM_USERNAME')!;
    this.password = this.config.get<string>('XTREAM_PASSWORD')!;
  }

  private buildUrl(action: string, extraParams?: Record<string, string | number>) {
    const url = new URL(`${this.baseUrl}/player_api.php`);
    url.searchParams.set('username', this.username);
    url.searchParams.set('password', this.password);
    url.searchParams.set('action', action);
    if (extraParams) {
      for (const key in extraParams) {
        const value = extraParams[key];
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value.toString());
        }
      }
    }
    return url.toString();
  }

  async getVodStreams(categoryId?: string) {
    const cacheKey = categoryId ? `vod:streams:${categoryId}` : 'vod:streams:all';
    const cached = await this.cacheManager.get<any[]>(cacheKey);
    if (cached) return cached;

    const params = categoryId ? { category_id: categoryId } : undefined;
    const response = await firstValueFrom(this.http.get(this.buildUrl('get_vod_streams', params)));

    const filteredResults = response.data.map((item: any) => ({
      id: item.stream_id,
      title: item.name,
      tmdb_id: item.tmdb_id,
      poster: item.stream_icon,
      category_id: item.category_id,
      rating: item.rating_5based,
    }));

    await this.cacheManager.set(cacheKey, filteredResults );
    return filteredResults;
  }

  async syncVodData(limitPerCategory = 50) {
    const start = new Date();
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    type SyncError =
      | { stream_id: number; error: string }
      | { global: string };
    const errors: SyncError[] = [];

    try {
      const categories = await this.categoriesService.getVodCategories();

      console.log(categories)

      for (const category of categories) {
        await this.prisma.vodCategory.upsert({
          where: { xtream_category_id: Number(category.category_id) },
          update: { name: category.category_name },
          create: {
            name: category.category_name,
            xtream_category_id: Number(category.category_id),
          },
        });
      }

      for (const category of categories) {
        const rawStreams = await this.getVodStreams(String(category.category_id));
        const streams = rawStreams.slice(0, limitPerCategory);

        for (const stream of streams) {
          try {
            const vodInfo = await this.getVodInfo(stream.id);

            const existing = await this.prisma.vodItem.findUnique({
              where: { xtream_vod_id: stream.id },
            });

            const saved = existing
              ? await this.prisma.vodItem.update({
                  where: { xtream_vod_id: stream.id },
                  data: {
                    title_original: stream.title,
                    title_normalized: stream.title.toLowerCase(),
                    category: { connect: { xtream_category_id: Number(category.category_id) } },
                    stream_icon: stream.poster,
                    added_at_xtream: new Date(Number(vodInfo.info?.added) * 1000),
                    container_extension: vodInfo.info?.container_extension ?? 'mp4',
                  },
                })
              : await this.prisma.vodItem.create({
                  data: {
                    xtream_vod_id: stream.id,
                    title_original: stream.title,
                    title_normalized: stream.title.toLowerCase(),
                    category: { connect: { xtream_category_id: Number(category.category_id) } },
                    stream_icon: stream.poster,
                    added_at_xtream: new Date(Number(vodInfo.info?.added) * 1000),
                    container_extension: vodInfo.info?.container_extension ?? 'mp4',
                  },
                });

            existing ? updated++ : inserted++;

            const tmdbId = vodInfo.info?.tmdb_id;
            if (tmdbId) {
              const tmdb = await this.getTmdbMovie(Number(tmdbId));

              await this.prisma.tmdbMovie.upsert({
                where: { vod_item_id: saved.id },
                update: {
                  tmdb_id: tmdb.id,
                  overview: tmdb.overview,
                  poster_path: tmdb.poster_path,
                  backdrop_path: tmdb.backdrop_path,
                  release_date: tmdb.release_date ? new Date(tmdb.release_date) : null,
                  runtime: tmdb.runtime,
                  vote_average: tmdb.vote_average,
                  genres: tmdb.genres,
                },
                create: {
                  vod_item_id: saved.id,
                  tmdb_id: tmdb.id,
                  overview: tmdb.overview,
                  poster_path: tmdb.poster_path,
                  backdrop_path: tmdb.backdrop_path,
                  release_date: tmdb.release_date ? new Date(tmdb.release_date) : null,
                  runtime: tmdb.runtime,
                  vote_average: tmdb.vote_average,
                  genres: tmdb.genres,
                },
              });
            }
          } catch (err) {
            skipped++;
            errors.push({
              stream_id: stream.id,
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
      }
    } catch (err) {
      errors.push({ global: err instanceof Error ? err.message : String(err) });
    }

    await this.prisma.syncRun.create({
      data: {
        started_at: start,
        finished_at: new Date(),
        status: errors.length > 0 ? 'completed_with_errors' : 'completed',
        inserted,
        updated,
        skipped,
        errors_json: errors,
      },
    });

    return {
      inserted,
      updated,
      skipped,
      errorsCount: errors.length,
    };
  }

   async getVodStreamsFiltered(params: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, search, page = 1, limit = 20 } = params;

    const cacheKey = `vod:streams_filtered:${categoryId ?? 'all'}:search=${search ?? ''}:page=${page}:limit=${limit}`;

    const cached = await this.cacheManager.get(cacheKey);
    console.log('vod do cache', cached)
    if (cached) {
      return cached;
    }
    const streams = await this.getVodStreams(categoryId);

    let filtered = streams;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((stream: any) =>
        stream.title?.toLowerCase().includes(searchLower),
      );
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    const result = {
      total: filtered.length,
      page,
      limit,
      results: paginated,
    };

    await this.cacheManager.set(cacheKey, result, 60000 );

    return result;
  }

  async getVodInfo(vodId: string) {
    const url = this.buildUrl('get_vod_info', { vod_id: vodId });
    const response = await firstValueFrom(this.http.get(url));
    return response.data;
  }

  async getTmdbMovie(tmdbId: number) {
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}`;
    const headers = {
      Authorization: `Bearer ${this.config.get<string>('TMDB_API_TOKEN')}`,
    };

    const response = await firstValueFrom(this.http.get(url, { headers }));
    return response.data;
  }

private areValuesEquivalent(val1: any, val2: any): boolean {
  if (val1 == null && val2 == null) return true;
  return isEqual(val1, val2);
}

private removeDuplicateFields(
  info: Record<string, any>,
  movieData: Record<string, any>,
): Record<string, any> {
  const cleanedMovieData = { ...movieData };

  for (const key of Object.keys(movieData)) {
    if (key in info) {
      const infoValue = info[key];
      const movieValue = movieData[key];

      const equivalent = this.areValuesEquivalent(infoValue, movieValue);

      if (equivalent) {
        delete cleanedMovieData[key];
      }
    }
  }

  return cleanedMovieData;
}

async getCombinedMovieData(vodId: string) {
  if (!vodId) return null;

  const cacheKey = `combined_movie:${vodId}`;

  const cached = await this.cacheManager.get(cacheKey);
  if (cached) return cached;

  const vodInfo = await this.getVodInfo(vodId);
  const tmdbId = vodInfo.tmdb_id || vodInfo?.data?.tmdb_id;

  const info = vodInfo.info || {};
  const movieData = vodInfo.movie_data || {};

  const cleanedMovieData = this.removeDuplicateFields(info, movieData);
  const mergedInfo = { ...info, ...cleanedMovieData };

  if (!tmdbId) {
    await this.cacheManager.set(cacheKey, { info: mergedInfo }, 60000);
    return { info: mergedInfo };
  }

  const tmdbData = await this.getTmdbMovie(Number(tmdbId));

  for (const [key, value] of Object.entries(tmdbData)) {
    if (!(key in mergedInfo) || mergedInfo[key] == null) {
      mergedInfo[key] = value;
    }
  }

  const combined = { info: mergedInfo };

  try {
    await this.cacheManager.set(cacheKey, combined, 60000);
  } catch (error) {
  }

  return combined;
}
}