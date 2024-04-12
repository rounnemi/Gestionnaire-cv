import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { In, Like, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) {}

  async findAll(): Promise<Cv[]> {
    return this.cvRepository.find();
  }

  async findOne(id: number): Promise<Cv> {
    return this.cvRepository.findOneBy({ id: id });
  }

  async findAllFiltered(filterDto: FilterDto): Promise<Cv[]> {
    const { query, age } = filterDto;
    return this.cvRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { firstname: Like(`%${query}%`) },
        { Job: Like(`%${query}%`) },
        { age: age },
      ],
    });
  }

  async findAllPaginated(page: number, pageSize: number): Promise<Cv[]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return this.cvRepository.find({
      skip,
      take,
    });
  }

  async create(cv: CreateCvDto): Promise<Cv> {
    // Find the user by userId
    /* const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const skills = await this.skillRepository.find({
      where: { id: In(skillIds) },
    });

    if (skills.length !== skillIds.length) {
      console.log(skills.length);
      console.log(skills);
      console.log(skillIds.length);
      throw new Error('Some skills not found');
    }

    // Assign the user and skills to the cv
    cv.user = user;
    cv.skills = skills;
    */

    // Save the cv
    return this.cvRepository.save(cv);
  }

  async update(id: number, newData: Partial<Cv>): Promise<Cv> {
    await this.cvRepository.update(id, newData);
    return this.cvRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<void> {
    await this.cvRepository.delete(id);
  }

  async findOneByIdAndSelect(id: number): Promise<Cv> {
    const cv = await this.cvRepository
      .createQueryBuilder('cv')
      .select(['cv.id', 'cv.path'])
      .where('cv.id = :id', { id })
      .getOne();

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    return cv;
  }
}
