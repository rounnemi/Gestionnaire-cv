import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { username, email, password } = signupDto;
    const user = this.userRepository.create({
      username,
      email,
      password,
      role: 'user',
    });
    return await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;
    const user = await this.userService.findByUsername(username);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      username: user.username,
      userId: user.id,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
