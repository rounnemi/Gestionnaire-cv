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
  ) {}
  @OnEvent(CvEvents.CV_CREATED)
  async handleCvCreated(payload: { cv: Cv; userid: number }) {
    try {
      const historique = new HistoriqueOperation();
      historique.cv = payload.cv; // Utilisez les données du payload
      historique.userid = payload.userid; // Utilisez les données du payload
      historique.type = CvEvents.CV_CREATED;
      await this.historiqueRepo.save(historique);
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'événement CV_CREATED :",
        error,
      );
      // Gérer l'erreur
    }
  }

  @OnEvent(CvEvents.CV_UPDATED)
  handleCvUpdated(payload: { cvId: number; newData: any }) {
    // Logique à effectuer lorsqu'un CV est mis à jour
  }

  @OnEvent(CvEvents.CV_DELETED)
  handleCvDeleted(cvId: number) {
    // Logique à effectuer lorsqu'un CV est supprimé
  }
}
