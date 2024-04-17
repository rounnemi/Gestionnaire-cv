import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SkillService } from './skill/skill.service';
import { UserService } from './user/user.service';
import { CvService } from './cv/cv.service';
import { Skill } from './skill/entities/skill.entity';

import {
  randEmail,
  randFirstName,
  randJobTitle,
  randLastName,
  randPassword,
  randSkill,
  randUserName,
} from '@ngneat/falso';
import { User } from './user/entities/user.entity';
import { Cv } from './cv/entities/cv.entity';

function randAge() {
  return Math.floor(Math.random() * (60 - 18 + 1)) + 18;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Récupération des services nécessaires
  const skillService = app.get(SkillService);
  const userService = app.get(UserService);
  const cvService = app.get(CvService);

  // Création des compétences
  const skills = [];
  for (let j = 0; j < 48; j++) {
    const skill = new Skill();
    skill.designation = randSkill();
    await skillService.create(skill);
    skills.push(skill);
  }

  const users = [];

  const cvs = [];
  for (let j = 0; j < 24; j++) {
    const cv = new Cv();
    cv.age = randAge();
    cv.Cin = randEmail();
    cv.firstname = randFirstName();
    cv.Job = randJobTitle();
    cv.name = randLastName();
    cv.path = '';
    cv.skills = [skills[j], skills[j + 1], skills[j + 2]];
    const user = new User();
    user.username = randUserName();
    user.password = randPassword();
    user.email = randEmail();
    await userService.create(user);
    cv.user = user;

    await cvService.create(cv);

    users.push(user);
    cvs.push(cv);
  }
  // Fermeture de l'application
  await app.close();
}

bootstrap();
