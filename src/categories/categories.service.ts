import { HttpService } from '@nestjs/axios';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export interface VodCategory {
  category_id: string;
  category_name: string;
}

@Injectable()
export class CategoriesService {
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('BASE_URL')!;
    this.username = this.config.get<string>('XTREAM_USERNAME')!;
    this.password = this.config.get<string>('XTREAM_PASSWORD')!;
  }

  private buildUrl(action: string, extraParams?: Record<string, string | number>) {
    const url = new URL(`${this.baseUrl}/player_api.php`);
    url.searchParams.set('username', this.username);
    url.searchParams.set('password', this.password);
    url.searchParams.set('action', action);

    if (extraParams) {
      for (const key in extraParams) {
        const value = extraParams[key];
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value.toString());
        }
      }
    }

    return url.toString();
  }

  async getVodCategories(): Promise<VodCategory[]> {
    const key = 'vod:categories';

    const cached = await this.cacheManager.get<VodCategory[]>(key);
    console.log('Categorias do cache:', cached);

    if (cached) {
      return cached;
    }
    
    const response = await firstValueFrom(this.http.get(this.buildUrl('get_vod_categories')));
    const filteredCategories = response.data.map((category: any) => ({
      category_id: category.category_id,
      category_name: category.category_name,
    }));

    await this.cacheManager.set(key, filteredCategories);
    console.log('Categorias salvas no cache Redis com chave:', key);
    return filteredCategories;
  }
}
