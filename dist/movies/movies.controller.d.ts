import { MoviesService } from './movies.service';
import { GetVodStreamsDto } from './dto/create-movie.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    getCategories(): Promise<any>;
    getStreams(query: GetVodStreamsDto): Promise<{
        total: any;
        page: number;
        limit: number;
        results: any;
    }>;
    getInfo(vodId: string): Promise<any>;
    getCombined(vodId: string): Promise<any>;
    sync(): Promise<{
        inserted: number;
        updated: number;
        skipped: number;
        errorsCount: number;
    }>;
}
