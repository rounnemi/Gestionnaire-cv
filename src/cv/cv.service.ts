import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { In, Like, Repository } from 'typeorm';
import { FilterDto } from './dto/filter.dto';
import { User } from 'src/user/entities/user.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { CvEvents } from '../common/events.config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HistoriqueOperation } from 'src/Historique/HistoriqueOperation.entity';
import { CvEvent } from 'src/events/cv.event';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    private eventEmitter: EventEmitter2,
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
    const result = this.cvRepository.save(newcv);
    newcv.user = user;
    newcv.skills = skills;
    this.eventEmitter.emit(
      'cv-event',
      new CvEvent(await result, user, CvEvents.CV_CREATED),
    );

    return result;
  }

  async update(id: number, newData: Partial<Cv>): Promise<Cv> {
    await this.cvRepository.update(id, newData);
    const cv = this.cvRepository.findOneBy({ id: id });
    this.eventEmitter.emit(
      'cv-event',
      new CvEvent(await cv, (await cv).user, CvEvents.CV_UPDATED),
    );

    return cv;
  }

  async remove(id: number): Promise<string> {
    const deletedCv = await this.cvRepository.findOneBy({ id });
    console.log(deletedCv);
    if (!deletedCv) {
      throw new NotFoundException(`CV with ID ${id} not found.`);
    }
    await this.cvRepository.softDelete(deletedCv.id);

    this.eventEmitter.emit(
      'cv-event',
      new CvEvent(await deletedCv, (await deletedCv).user, CvEvents.CV_DELETED),
    );

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
