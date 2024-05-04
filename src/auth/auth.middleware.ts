import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization header is missing' });
    }

    try {
      const decodedToken = jwt.verify(token.toString(), 'secret_key');
      req['user'] = {
        userId: decodedToken['userId'],
        role: decodedToken['role'],
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
