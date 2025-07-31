import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis';

@Module({
  imports: [
    MoviesModule, CategoriesModule, ConfigModule.forRoot({
      isGlobal: true,
    }), 
  PrismaModule,
  CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({ socket: { host: 'localhost', port: 6379 } }),
        ttl: 3600, 
      }),
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
