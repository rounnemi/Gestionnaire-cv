import { CvEvents } from 'src/common/events.config';
import { Cv } from 'src/cv/entities/cv.entity';
import { User } from 'src/user/entities/user.entity';

export class CvEvent {
  constructor(
    public cv: Cv,
    public user: User,
    public eventType: CvEvents,
  ) {}
}
