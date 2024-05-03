import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueOperation } from './HistoriqueOperation.entity';
import { CvEventHandler } from './cv.event.handler';
import { Cv } from '../cv/entities/cv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriqueOperation, Cv])],
  providers: [CvEventHandler],
})
export class historiqueModule {}
