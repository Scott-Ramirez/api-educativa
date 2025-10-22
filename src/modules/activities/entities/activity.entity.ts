import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date' })
  fecha: string; // Fecha de la actividad

  @Column({ type: 'float', nullable: true })
  nota: number; // Nota del día o de la actividad

  @ManyToOne(() => Student, { eager: true, onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => Subject, { eager: true, onDelete: 'CASCADE' })
  subject: Subject;

  @CreateDateColumn()
  created_at: Date;
}
