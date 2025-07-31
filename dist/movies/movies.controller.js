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
exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const movies_service_1 = require("./movies.service");
const swagger_1 = require("@nestjs/swagger");
const create_movie_dto_1 = require("./dto/create-movie.dto");
let MoviesController = class MoviesController {
    moviesService;
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    getCategories() {
        return this.moviesService.getVodCategories();
    }
    getStreams(query) {
        return this.moviesService.getVodStreamsFiltered(query);
    }
    getInfo(vodId) {
        return this.moviesService.getVodInfo(vodId);
    }
    getCombined(vodId) {
        return this.moviesService.getCombinedMovieData(vodId);
    }
    sync() {
        return this.moviesService.syncVodData();
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todas as categorias VOD' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('streams'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista filmes com filtros e paginação' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movie_dto_1.GetVodStreamsDto]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "getStreams", null);
__decorate([
    (0, common_1.Get)('info/:vodId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtém detalhes de um filme VOD' }),
    (0, swagger_1.ApiParam)({ name: 'vodId', description: 'ID do filme' }),
    __param(0, (0, common_1.Param)('vodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "getInfo", null);
__decorate([
    (0, common_1.Get)('combined/:vodId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtém dados combinados do filme (Xtream + TMDB)' }),
    (0, swagger_1.ApiParam)({ name: 'vodId', description: 'ID do filme' }),
    __param(0, (0, common_1.Param)('vodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "getCombined", null);
__decorate([
    (0, common_1.Get)('sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sincroniza categorias e filmes da Xtream com dados do TMDB' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "sync", null);
exports.MoviesController = MoviesController = __decorate([
    (0, swagger_1.ApiTags)('Movies'),
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map