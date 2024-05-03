import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CvEvents } from '../common/events.config';
import { CreateCvDto } from 'src/cv/dto/create-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoriqueOperation } from './HistoriqueOperation.entity';
import { Repository } from 'typeorm';
import { Cv } from 'src/cv/entities/cv.entity';

@Injectable()
export class CvEventHandler {
  constructor(
    @InjectRepository(HistoriqueOperation)
    private readonly historiqueRepo: Repository<HistoriqueOperation>,
    @InjectRepository(Cv)
    private readonly Cvrepo: Repository<Cv>,
  ) {}
  @OnEvent(CvEvents.CV_CREATED)
  async handleCvCreated(payload: { cv: Cv; userid: number }) {
    try {
      const historique = new HistoriqueOperation();
      const cvv = await this.Cvrepo.findOneBy({ id: payload.cv.id });

      historique.cv = cvv; // Utilisez les données du payload
      historique.userid = payload.userid; // Utilisez les données du payload
      historique.type = CvEvents.CV_CREATED;
      await this.historiqueRepo.save(historique);
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'événement CV_CREATED :",
        error,
      );
    }
  }

  @OnEvent(CvEvents.CV_UPDATED)
  async handleCvUpdated(payload: { cv: Cv; userid: number }) {
    try {
      const historique = new HistoriqueOperation();
      const cvv = await this.Cvrepo.findOneBy({ id: payload.cv.id });

      historique.cv = cvv; // Utilisez les données du payload
      historique.userid = payload.userid; // Utilisez les données du payload
      historique.type = CvEvents.CV_UPDATED;
      await this.historiqueRepo.save(historique);
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'événement CV_CREATED :",
        error,
      );
    }
  }
}
