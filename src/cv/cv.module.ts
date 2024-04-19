import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { CvControllerV2 } from './cv.controllerv2';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { SkillModule } from '../skill/skill.module';
import { AdminGuard } from 'src/admin/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv, User, Skill]),
    PassportModule,
    UserModule,
    SkillModule,
  ],

  controllers: [CvController, CvControllerV2],
  providers: [CvService, AdminGuard],
})
export class CvModule {}
