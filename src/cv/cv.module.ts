import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cv])],

  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
