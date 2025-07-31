import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class MoviesService {
    private readonly http;
    private readonly config;
    private readonly prisma;
    private readonly baseUrl;
    private readonly username;
    private readonly password;
    constructor(http: HttpService, config: ConfigService, prisma: PrismaService);
    private buildUrl;
    getVodCategories(): Promise<any>;
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
    }): Promise<{
        total: any;
        page: number;
        limit: number;
        results: any;
    }>;
    getVodInfo(vodId: string): Promise<any>;
    getTmdbMovie(tmdbId: number): Promise<any>;
    getCombinedMovieData(vodId: string): Promise<any>;
}
