import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.cvs', 'cvs')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async create(user: CreateUserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.userRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
