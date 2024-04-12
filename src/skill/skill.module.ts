import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { Skill } from './entities/skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],

  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule {}
