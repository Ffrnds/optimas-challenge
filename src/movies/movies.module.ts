import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PrismaModule,
  ],
  providers: [
    MoviesService,
    PrismaModule,
  ],
  controllers: [MoviesController],
})
export class MoviesModule { }
