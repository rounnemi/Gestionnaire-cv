import { Timestamp } from 'src/common/Timestamp.entity';
import { Cv } from '../../cv/entities/cv.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HistoriqueOperation } from 'src/Historique/HistoriqueOperation.entity';

@Entity()
export class User extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // Default role is 'user'
  role: string;

  @OneToMany(() => Cv, (cv) => cv.user)
  cvs: Cv[];

  @OneToMany(() => HistoriqueOperation, (historique) => historique.performedBy)
  historiques: HistoriqueOperation[];
}
