import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true, type: 'text' })
  descripcion: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  icono: string;

  @CreateDateColumn()
  created_at: Date;
}
