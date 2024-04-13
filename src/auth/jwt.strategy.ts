// jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret_key',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId } = payload;
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
