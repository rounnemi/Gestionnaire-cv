import { Cv } from '../../cv/entities/cv.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designation: string;

  @ManyToMany(() => Cv, (cv) => cv.skills)
  @JoinTable()
  cvs: Cv[];
}
