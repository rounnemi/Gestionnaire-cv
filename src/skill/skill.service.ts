import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
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

  async remove(id: number): Promise<string> {
    const deletedSkill = await this.skillRepository.findOneBy({ id });
    if (!deletedSkill) {
      throw new NotFoundException(`Skill with ID ${id} not found.`);
    }
    await this.skillRepository.remove(deletedSkill);
    return `Skill ${id} is deleted.`;
  }
}
