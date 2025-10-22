import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string; // formato YYYY-MM-DD

  @Column()
  estado: string; // 'PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO'

  @Column({ nullable: true })
  hora_llegada: string; // formato HH:mm

  @Column({ nullable: true, type: 'text' })
  justificacion: string;

  @Column({ nullable: true, type: 'text' })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student;
}