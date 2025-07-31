import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';

const redisStore = require('cache-manager-ioredis'); // tive que fazer o import dessa forma pois estava dando erro 

@Module({
  imports: [
    MoviesModule,
    CategoriesModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }, ),
    PrismaModule,
    CacheModule.registerAsync({
      isGlobal: true, 
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        socket: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: +configService.get('REDIS_PORT') || 6379,
        },
        ttl: 60000,
  }),
}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
