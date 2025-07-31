import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cache } from 'cache-manager';
import { CategoriesService } from 'src/categories/categories.service';
export declare class MoviesService {
    private cacheManager;
    private readonly http;
    private readonly config;
    private readonly prisma;
    private readonly categoriesService;
    private readonly baseUrl;
    private readonly username;
    private readonly password;
    constructor(cacheManager: Cache, http: HttpService, config: ConfigService, prisma: PrismaService, categoriesService: CategoriesService);
    private buildUrl;
    getVodStreams(categoryId?: string): Promise<any>;
    syncVodData(limitPerCategory?: number): Promise<{
        inserted: number;
        updated: number;
        skipped: number;
        errorsCount: number;
    }>;
    getVodStreamsFiltered(params: {
        categoryId?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{}>;
    getVodInfo(vodId: string): Promise<any>;
    getTmdbMovie(tmdbId: number): Promise<any>;
    private areValuesEquivalent;
    private removeDuplicateFields;
    getCombinedMovieData(vodId: string): Promise<{} | null>;
}
