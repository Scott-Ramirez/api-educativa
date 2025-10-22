import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  codeHash: string; // hash del token

  @ManyToOne(() => Student, { onDelete: 'SET NULL', nullable: true })
  student?: Student;

  @ManyToOne(() => User, { nullable: true })
  createdBy?: User;

  @ManyToOne(() => User, { nullable: true })
  usedBy?: User;

  @Column({ default: false })
  used: boolean;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
