import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoriqueOperation } from './HistoriqueOperation.entity';
import { Repository } from 'typeorm';
import { CvEvent } from 'src/events/cv.event';

@Injectable()
export class CvEventHandler {
  constructor(
    @InjectRepository(HistoriqueOperation)
    private readonly historiqueRepository: Repository<HistoriqueOperation>,
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
      historique.cvContent = JSON.stringify(data.cv);
      await this.historiqueRepository.save(historique);
    } catch (error) {
      console.error("Erreur lors de la gestion de l'événement", error);
    }
  }
}
