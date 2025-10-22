import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('behaviors')
export class Behavior {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string; // formato YYYY-MM-DD

  @Column()
  estado: string; // Ej: Excelente, Bueno, Regular, Malo

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Student, { eager: true, onDelete: 'CASCADE' })
  student: Student;

  @CreateDateColumn()
  created_at: Date;
}
