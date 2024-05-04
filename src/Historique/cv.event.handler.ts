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

  @OnEvent(CvEvents.CV_CREATED)
  async handleCvCreated(data: CvEvent) {
    this.handleCv(data, CvEvents.CV_CREATED);
  }
  @OnEvent(CvEvents.CV_UPDATED)
  async handleCvUpdated(data: CvEvent) {
    this.handleCv(data, CvEvents.CV_UPDATED);
  }
  @OnEvent(CvEvents.CV_DELETED)
  async handleCvDeleted(data: CvEvent) {
    this.handleCv(data, CvEvents.CV_DELETED);
  }

  async handleCv(data: CvEvent, operationType: string) {
    try {
      const historique = new HistoriqueOperation();
      historique.cv = data.cv;
      historique.performedBy = data.user;
      historique.type = operationType;
      await this.historiqueRepo.save(historique);
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'événement CV_CREATED :",
        error,
      );
    }
  }
}
