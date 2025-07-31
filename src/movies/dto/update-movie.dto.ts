import { PartialType } from '@nestjs/swagger';
import { GetVodStreamsDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(GetVodStreamsDto) {}
