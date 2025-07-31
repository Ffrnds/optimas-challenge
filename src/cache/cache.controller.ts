import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Post(':key')
  async setCache(@Param('key') key: string, @Body() body: { value: any }) {
    await this.cacheService.set(key, body.value);
    return { message: 'Value cached' };
  }

  @Get(':key')
  async getCache(@Param('key') key: string) {
    const value = await this.cacheService.get(key);
    return { key, value };
  }

  @Delete(':key')
  async deleteCache(@Param('key') key: string) {
    await this.cacheService.del(key);
    return { message: 'Key deleted' };
  }
}
