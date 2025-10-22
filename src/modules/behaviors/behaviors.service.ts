import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Behavior } from './entities/behavior.entity';
import { CreateBehaviorDto } from './dto/create-behavior.dto';
import { UpdateBehaviorDto } from './dto/update-behavior.dto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class BehaviorsService {
  constructor(
    @InjectRepository(Behavior)
    private behaviorRepo: Repository<Behavior>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async create(dto: CreateBehaviorDto) {
    const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Estudiante no encontrado');

    const behavior = this.behaviorRepo.create({
      fecha: dto.fecha,
      estado: dto.estado,
      observaciones: dto.observaciones,
      student,
    });

    const saved = await this.behaviorRepo.save(behavior);
    return {
      message: `Registro de comportamiento para ${saved.student.nombre} (${saved.fecha}) creado: ${saved.estado}.`,
      id: saved.id,
    };
  }

  async findAll() {
    return await this.behaviorRepo.find({ relations: ['student'] });
  }

  async findByStudent(studentId: number) {
    return await this.behaviorRepo.find({ 
      where: { student: { id: studentId } },
      relations: ['student'],
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: number) {
    const behavior = await this.behaviorRepo.findOne({ where: { id }, relations: ['student'] });
    if (!behavior) throw new NotFoundException('Registro de comportamiento no encontrado');
    return behavior;
  }

  async update(id: number, dto: UpdateBehaviorDto) {
    const behavior = await this.findOne(id);

    if (dto.studentId) {
      const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
      if (!student) throw new NotFoundException('Estudiante no encontrado');
      behavior.student = student;
    }

    Object.assign(behavior, dto);
    const updated = await this.behaviorRepo.save(behavior);
    return {
      message: `Registro ${updated.id} para ${updated.student.nombre} actualizado: ${updated.estado} (${updated.fecha}).`,
      id: updated.id,
    };
  }

  async remove(id: number) {
    const behavior = await this.findOne(id);
    await this.behaviorRepo.remove(behavior);
    return { message: `Registro ${behavior.id} para ${behavior.student.nombre} removido satisfactoriamente.`, id };
  }
}
