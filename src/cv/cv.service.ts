import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { Like, Repository } from 'typeorm';
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

  /*async findOne(id: number): Promise<Cv> {
    return this.cvRepository
      .createQueryBuilder('cv')
      .leftJoinAndSelect('cv.user', 'user')
      .leftJoinAndSelect('cv.skills', 'skills')
      .where('cv.id = :id', { id })
      .getOne();
  }*/

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

  // async findAllPaginated(page: number, pageSize: number): Promise<Cv[]> {
  //   const skip = (page - 1) * pageSize;
  //   const take = pageSize;
  //   return this.cvRepository.find({
  //     skip,
  //     take,
  //   });
  // }

  async create(cv: CreateCvDto): Promise<Cv> {
    return this.cvRepository.save(cv);
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
