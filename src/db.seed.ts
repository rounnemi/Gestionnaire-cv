import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SkillService } from './skill/skill.service';
import { UserService } from './user/user.service';
import { CvService } from './cv/cv.service';
import { Skill } from './skill/entities/skill.entity';

import {
  randEmail,
  randFilePath,
  randFirstName,
  randJobTitle,
  randLastName,
  randNumber,
  randPassword,
  randSkill,
  randUserName,
} from '@ngneat/falso';
import { User } from './user/entities/user.entity';
import { Cv } from './cv/entities/cv.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Récupération des services nécessaires
  const skillService = app.get(SkillService);
  const userService = app.get(UserService);
  const cvService = app.get(CvService);

  // Création des compétences
  const skills = [];
  for (let j = 0; j < 12; j++) {
    const skill = new Skill();
    skill.designation = randSkill();
    await skillService.create(skill);
    skills.push(skill);
  }

  // Create and associate CVs with Skills
  const cvs = [];
  for (let j = 0; j < 6; j++) {
    const cv = new Cv();
    cv.age = randNumber();
    cv.Cin = randEmail();
    cv.firstname = randFirstName();
    cv.Job = randJobTitle();
    cv.name = randLastName();
    cv.path = randFilePath();
    // Don't associate skills here
    const user = new User();
    user.username = randUserName();
    user.password = randPassword();
    user.email = randEmail();
    await userService.create(user);
    cv.user = user;

    // Persist CV first
    const createdCv = await cvService.create(cv);
    cvs.push(createdCv);
  }

  // Now associate CVs with Skills
  for (let i = 0; i < cvs.length; i++) {
    cvs[i].skills = []; // Initialize skills array
    for (let j = 0; j < 3; j++) {
      // Randomly associate skills
      const skillIndex = Math.floor(Math.random() * skills.length);
      const skill = skills[skillIndex];
      cvs[i].skills.push(skill);
    }
    // Update CV entity with associated skills
    await cvService.update(cvs[i].id, { skills: cvs[i].skills });
  }

  // Fermeture de l'application
  await app.close();
}

bootstrap();
