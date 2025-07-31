import { MoviesService } from './movies.service';
import { GetVodStreamsDto } from './dto/create-movie.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    getStreams(query: GetVodStreamsDto): Promise<{}>;
    getInfo(vodId: string): Promise<any>;
    getCombined(vodId: string): Promise<{} | null>;
    sync(): Promise<{
        inserted: number;
        updated: number;
        skipped: number;
        errorsCount: number;
    }>;
}
