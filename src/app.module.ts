/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkillModule } from './skill/skill.module';
import { UserModule } from './user/user.module';
import { CvModule } from './cv/cv.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './cv/entities/cv.entity';
import { Skill } from './skill/entities/skill.entity';
import { User } from './user/entities/user.entity';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { MulterConfigModule } from './multer/multer.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HistoriqueOperation } from './Historique/HistoriqueOperation.entity';
import { historiqueModule } from './Historique/historique.module';

@Module({
  imports: [
    SkillModule,
    CvModule,
    UserModule,
    historiqueModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'sql123',
      database: 'newnest',
      entities: [Cv, User, Skill ,HistoriqueOperation ] ,
      synchronize: true,
    }),
    AuthModule,
    MulterConfigModule,
    EventEmitterModule.forRoot()

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('cv/v2' ,'cv/sse');
  }
}
