import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dia: string; // Lunes, Martes, etc.

  @Column()
  hora_inicio: string; // Ej: 08:00

  @Column()
  hora_fin: string; // Ej: 09:00

  @ManyToOne(() => Subject, { eager: true, onDelete: 'CASCADE' })
  subject: Subject;

  @CreateDateColumn()
  created_at: Date;
}
