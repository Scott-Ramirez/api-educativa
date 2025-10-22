import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  edad: number;

  @Column()
  grado: string;

  @Column({ default: 'primaria' })
  nivel: string;

  @Column({ nullable: true })
  foto_url: string;

  @Column({ nullable: true, type: 'text' })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.students, { onDelete: 'SET NULL' })
  user: User;
}
