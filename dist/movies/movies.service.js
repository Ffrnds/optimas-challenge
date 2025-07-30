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
let MoviesService = class MoviesService {
    http;
    config;
    baseUrl;
    username;
    password;
    constructor(http, config) {
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
                if (value !== undefined) {
                    url.searchParams.set(key, value);
                }
            }
        }
        return url.toString();
    }
    async getVodCategories() {
        const url = this.buildUrl('get_vod_categories');
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url));
        console.log('Categorias VOD:', response.data);
        return response.data;
    }
    async getVodStreams(categoryId) {
        const params = categoryId
            ? { category_id: categoryId }
            : undefined;
        const url = this.buildUrl('get_vod_streams', params);
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url));
        console.log('Lista de Filmes:', response.data);
        return response.data;
    }
    async getVodInfo(vodId) {
        const url = this.buildUrl('get_vod_info', { vod_id: vodId });
        const response = await (0, rxjs_1.firstValueFrom)(this.http.get(url));
        console.log(`Informações do filme ${vodId}:`, response.data);
        return response.data;
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map