import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Lista todas as categorias VOD' })
  getCategories() {
    return this.moviesService.getVodCategories();
  }

  @Get('streams')
  @ApiOperation({ summary: 'Lista filmes de uma categoria (opcional)' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'ID da categoria VOD' })
  getStreams(@Query('categoryId') categoryId?: string) {
    return this.moviesService.getVodStreams(categoryId);
  }

  @Get('info/:vodId')
  @ApiOperation({ summary: 'Obtém detalhes de um filme VOD' })
  @ApiParam({ name: 'vodId', description: 'ID do filme' })
  getInfo(@Param('vodId') vodId: string) {
    return this.moviesService.getVodInfo(vodId);
  }
}
