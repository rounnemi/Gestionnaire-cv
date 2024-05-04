import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CvEvents } from '../common/events.config';
import { CreateCvDto } from 'src/cv/dto/create-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoriqueOperation } from './HistoriqueOperation.entity';
import { Repository } from 'typeorm';
import { Cv } from 'src/cv/entities/cv.entity';
import { User } from 'src/user/entities/user.entity';
import { CvEvent } from 'src/events/cv.event';

@Injectable()
export class CvEventHandler {
  constructor(
    @InjectRepository(HistoriqueOperation)
    private readonly historiqueRepo: Repository<HistoriqueOperation>,
    @InjectRepository(Cv)
    private readonly Cvrepo: Repository<Cv>,
  ) {}

  @OnEvent('cv-event')
  async handleCvCreated(data: CvEvent) {
    this.handleCv(data);
  }


  async handleCv(data: CvEvent) {
    try {
      const historique = new HistoriqueOperation();
      historique.cv = data.cv;
      historique.performedBy = data.user;
      historique.type = data.eventType;
      await this.historiqueRepo.save(historique);
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'événement CV_CREATED :",
        error,
      );
    }
  }
}
