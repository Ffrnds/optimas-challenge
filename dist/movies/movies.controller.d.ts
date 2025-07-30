import { MoviesService } from './movies.service';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    getCategories(): Promise<any>;
    getStreams(categoryId?: string): Promise<any>;
    getInfo(vodId: string): Promise<any>;
}
