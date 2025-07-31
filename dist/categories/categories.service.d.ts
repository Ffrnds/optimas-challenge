import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
export interface VodCategory {
    category_id: string;
    category_name: string;
}
export declare class CategoriesService {
    private cacheManager;
    private readonly http;
    private readonly config;
    private readonly baseUrl;
    private readonly username;
    private readonly password;
    constructor(cacheManager: Cache, http: HttpService, config: ConfigService);
    private buildUrl;
    getVodCategories(): Promise<VodCategory[]>;
}
