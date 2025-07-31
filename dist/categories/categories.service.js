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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const cache_manager_1 = require("@nestjs/cache-manager");
let CategoriesService = class CategoriesService {
    cacheManager;
    http;
    config;
    baseUrl;
    username;
    password;
    constructor(cacheManager, http, config) {
        this.cacheManager = cacheManager;
        this.http = http;
        this.config = config;
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
        const key = 'vod:categories';
        const cached = await this.cacheManager.get(key);
        console.log('Categorias do cache:', cached);
        if (cached) {
            return cached;
        }
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(this.buildUrl('get_vod_categories')));
        const filteredCategories = response.data.map((category) => ({
            category_id: category.category_id,
            category_name: category.category_name,
        }));
        await this.cacheManager.set(key, filteredCategories);
        console.log('Categorias salvas no cache Redis com chave:', key);
        return filteredCategories;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, axios_1.HttpService,
        config_1.ConfigService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map