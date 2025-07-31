"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma/prisma.service");
let MoviesService = class MoviesService {
    http;
    config;
    prisma;
    baseUrl;
    username;
    password;
    constructor(http, config, prisma) {
        this.http = http;
        this.config = config;
        this.prisma = prisma;
        this.baseUrl = this.config.get('BASE_URL');
        this.username = this.config.get('XTREAM_USERNAME');
        this.password = this.config.get('XTREAM_PASSWORD');
    }
    buildUrl(action, extraParams) {
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
    async getVodCategories() {
        const url = this.buildUrl('get_vod_categories');
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url));
        return response.data;
    }
    async getVodStreams(categoryId) {
        const params = categoryId ? { category_id: categoryId } : undefined;
        const url = this.buildUrl('get_vod_streams', params);
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url));
        const filteredResults = response.data.map((item) => ({
            id: item.stream_id,
            title: item.name,
            tmdb_id: item.tmdb_id,
            poster: item.stream_icon,
            category_id: item.category_id,
            rating: item.rating_5based,
        }));
        return filteredResults;
    }
    async syncVodData(limitPerCategory = 50) {
        const start = new Date();
        let inserted = 0;
        let updated = 0;
        let skipped = 0;
        const errors = [];
        try {
            const categories = await this.getVodCategories();
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
                    }
                    catch (err) {
                        skipped++;
                        errors.push({
                            stream_id: stream.id,
                            error: err instanceof Error ? err.message : String(err),
                        });
                    }
                }
            }
        }
        catch (err) {
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
    async getVodStreamsFiltered(params) {
        const { categoryId, search, page = 1, limit = 20 } = params;
        const streams = await this.getVodStreams(categoryId);
        let filtered = streams;
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter((stream) => stream.name?.toLowerCase().includes(searchLower));
        }
        const startIndex = (page - 1) * limit;
        const paginated = filtered.slice(startIndex, startIndex + limit);
        return {
            total: filtered.length,
            page,
            limit,
            results: paginated,
        };
    }
    async getVodInfo(vodId) {
        const url = this.buildUrl('get_vod_info', { vod_id: vodId });
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url));
        return response.data;
    }
    async getTmdbMovie(tmdbId) {
        const url = `https://api.themoviedb.org/3/movie/${tmdbId}`;
        const headers = {
            Authorization: `Bearer ${this.config.get('TMDB_API_TOKEN')}`,
        };
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url, { headers }));
        return response.data;
    }
    async getCombinedMovieData(vodId) {
        const vodInfo = await this.getVodInfo(vodId);
        const tmdbId = vodInfo.tmdb_id || (vodInfo?.data && vodInfo.data.tmdb_id);
        if (!tmdbId) {
            return { ...vodInfo };
        }
        const tmdbData = await this.getTmdbMovie(Number(tmdbId));
        return {
            ...vodInfo,
            tmdb: tmdbData,
        };
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map