import { Controller, Get, Query, Param, Search } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { GetVodStreamsDto } from './dto/create-movie.dto';

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
  @ApiOperation({ summary: 'Lista filmes com filtros e paginação' })
  getStreams(@Query() query: GetVodStreamsDto) {
    return this.moviesService.getVodStreamsFiltered(query);
  }

  @Get('info/:vodId')
  @ApiOperation({ summary: 'Obtém detalhes de um filme VOD' })
  @ApiParam({ name: 'vodId', description: 'ID do filme' })
  getInfo(@Param('vodId') vodId: string) {
    return this.moviesService.getVodInfo(vodId);
  }

  @Get('combined/:vodId')
  @ApiOperation({ summary: 'Obtém dados combinados do filme (Xtream + TMDB)' })
  @ApiParam({ name: 'vodId', description: 'ID do filme' })
  getCombined(@Param('vodId') vodId: string) {
    return this.moviesService.getCombinedMovieData(vodId);
  }
  @Get('sync')
  @ApiOperation({ summary: 'Sincroniza categorias e filmes da Xtream com dados do TMDB' })
  sync() {
    return this.moviesService.syncVodData(); 
  }

}
