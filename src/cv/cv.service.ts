import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { In, Like, Repository } from 'typeorm';
import { FilterDto } from './dto/filter.dto';
import { User } from 'src/user/entities/user.entity';
import { Skill } from 'src/skill/entities/skill.entity';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async findAll(): Promise<Cv[]> {
    return this.cvRepository.find();
  }

  /*async findOne(id: number): Promise<Cv> {
    return this.cvRepository.findOneBy({ id: id });
  }*/

  async createseed(cv: Cv): Promise<Cv> {
    return this.cvRepository.save(cv);
  }
  async findOne(id: number): Promise<Cv> {
    return this.cvRepository
      .createQueryBuilder('cv')
      .leftJoinAndSelect('cv.user', 'user')
      .leftJoinAndSelect('cv.skills', 'skills')
      .where('cv.id = :id', { id })
      .getOne();
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
    const user = await this.userRepository.findOneBy({ id: cv.userID });
    if (!user) {
      throw new Error('User not found');
    }

    const skills = await this.skillRepository.find({
      where: { id: In(cv.skillsId) },
    });

    if (skills.length !== cv.skillsId.length) {
      throw new Error('Some skills not found');
    }
    const newcv = this.cvRepository.create(cv);

    newcv.user = user;
    newcv.skills = skills;
    return this.cvRepository.save(newcv);
  }

  async update(id: number, newData: Partial<Cv>): Promise<Cv> {
    console.log(newData);
    await this.cvRepository.update(id, newData);

    return this.cvRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<string> {
    const deletedCv = await this.cvRepository.findOneBy({ id });
    if (!deletedCv) {
      throw new NotFoundException(`Skill with ID ${id} not found.`);
    }
    await this.cvRepository.remove(deletedCv);
    return `cv ${id} is deleted.`;
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
