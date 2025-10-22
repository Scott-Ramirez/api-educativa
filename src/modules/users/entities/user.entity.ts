import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'PARENT' })
  role: string; // 'PARENT' | 'ADMIN'

  @OneToMany(() => Student, (student) => student.user)
  students: Student[];
}
