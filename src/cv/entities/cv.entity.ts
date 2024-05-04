import { Timestamp } from 'src/common/Timestamp.entity';
import { HistoriqueOperation } from '../../Historique/HistoriqueOperation.entity';
import { Skill } from '../../skill/entities/skill.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Cv extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column()
  age: number;

  @Column()
  Cin: string;

  @Column()
  Job: string;

  @Column({ default: '' })
  path: string;

  @ManyToOne(() => User, (user) => user.cvs, { eager: true })
  user: User;
  @ManyToMany(() => Skill, (cv) => cv.cvs)
  skills: Skill[];
  @OneToMany(() => HistoriqueOperation, (historique) => historique.cv, {
    onDelete: 'CASCADE',
  })
  historiques: HistoriqueOperation[];
}
