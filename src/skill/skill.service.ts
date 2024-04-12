import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find();
  }

  async findById(id: number): Promise<Skill> {
    return this.skillRepository.findOneBy({ id: id });
  }

  async create(skill: CreateSkillDto): Promise<Skill> {
    return this.skillRepository.save(skill);
  }

  async update(id: number, skillData: Partial<Skill>): Promise<Skill> {
    await this.skillRepository.update(id, skillData);
    return this.skillRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<void> {
    await this.skillRepository.delete(id);
  }
}
