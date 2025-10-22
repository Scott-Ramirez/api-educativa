import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 4, scale: 2 })
  calificacion: number;

  @Column()
  tipo: string; // 'EXAMEN', 'TAREA', 'PROYECTO', 'PARTICIPACION'

  @Column()
  descripcion: string;

  @Column()
  fecha: string; // formato YYYY-MM-DD

  @Column()
  periodo: string; // 'PRIMER_PARCIAL', 'SEGUNDO_PARCIAL', 'TERCER_PARCIAL'

  @Column({ default: 100 })
  valor_maximo: number;

  @Column({ nullable: true, type: 'text' })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  subject: Subject;
}