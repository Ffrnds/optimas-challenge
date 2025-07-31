import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import cacheManager, { Cache } from 'cache-manager';
import redisStore from 'cache-manager-ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private cache: Cache;

  async onModuleInit() {
    const caching = (cacheManager as any).caching;

    this.cache = caching({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
      ttl: 600,
    });
  }

   async onModuleDestroy() {
    // @ts-ignore
    await this.cache.store.quit();
  }

  async get(key: string) {
    return this.cache.get(key);
  }

  async set(key: string, value: any, ttl?: number) {
    return this.cache.set(key, value,  ttl );
  }

  async del(key: string) {
    return this.cache.del(key);
  }
}
