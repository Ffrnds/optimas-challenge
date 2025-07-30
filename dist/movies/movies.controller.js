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
let MoviesController = class MoviesController {
    moviesService;
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    getCategories() {
        return this.moviesService.getVodCategories();
    }
    getStreams(categoryId) {
        return this.moviesService.getVodStreams(categoryId);
    }
    getInfo(vodId) {
        return this.moviesService.getVodInfo(vodId);
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
    (0, swagger_1.ApiOperation)({ summary: 'Lista filmes de uma categoria (opcional)' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, description: 'ID da categoria VOD' }),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
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
exports.MoviesController = MoviesController = __decorate([
    (0, swagger_1.ApiTags)('Movies'),
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map