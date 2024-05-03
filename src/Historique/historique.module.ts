import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriqueOperation } from './HistoriqueOperation.entity';
import { CvEventHandler } from './cv.event.handler';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriqueOperation])],
  providers : [CvEventHandler]
})
export class historiqueModule {}
