import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class MoviesService {
    private readonly http;
    private readonly config;
    private readonly baseUrl;
    private readonly username;
    private readonly password;
    constructor(http: HttpService, config: ConfigService);
    private buildUrl;
    getVodCategories(): Promise<any>;
    getVodStreams(categoryId?: string): Promise<any>;
    getVodInfo(vodId: string): Promise<any>;
}
