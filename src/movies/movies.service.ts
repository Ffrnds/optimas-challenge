import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('BASE_URL')!;
    this.username = this.config.get<string>('XTREAM_USERNAME')!;
    this.password = this.config.get<string>('XTREAM_PASSWORD')!;
  }

  private buildUrl(action: string, extraParams?: Record<string, string>) {
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
    const response = await firstValueFrom(this.http.get(url));
    console.log('Categorias VOD:', response.data);
    return response.data;
  }

  async getVodStreams(categoryId?: string) {
    const params: Record<string, string> | undefined = categoryId
      ? { category_id: categoryId }
      : undefined;

    const url = this.buildUrl('get_vod_streams', params);
    const response = await firstValueFrom(this.http.get(url));
    console.log('Lista de Filmes:', response.data);
    return response.data;
  }

  async getVodInfo(vodId: string) {
    const url = this.buildUrl('get_vod_info', { vod_id: vodId });
    const response = await firstValueFrom(this.http.get(url));
    console.log(`Informações do filme ${vodId}:`, response.data);
    return response.data;
  }
}
