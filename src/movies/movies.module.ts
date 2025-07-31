import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaModule } from '../prisma/prisma.module'; 
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PrismaModule,
    CategoriesModule,
  ],
  providers: [
    MoviesService,
    PrismaModule,
  ],
  controllers: [MoviesController],
})
export class MoviesModule { }
