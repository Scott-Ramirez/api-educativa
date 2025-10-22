import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
  ) {}

  async create(dto: CreateActivityDto) {
    const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Estudiante no encontrado');

    const subject = await this.subjectRepo.findOne({ where: { id: dto.subjectId } });
    if (!subject) throw new NotFoundException('Materia no encontrada');

    const activity = this.activityRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      fecha: dto.fecha,
      nota: dto.nota,
      student,
      subject,
    });

    const saved = await this.activityRepo.save(activity);
    return {
      message: `Actividad '${saved.titulo}' para ${saved.student.nombre} (${saved.subject.nombre}) creada satisfactoriamente.`,
      id: saved.id,
    };
  }

  async findAll() {
    return await this.activityRepo.find({ relations: ['student', 'subject'] });
  }

  async findByStudent(studentId: number) {
    return await this.activityRepo.find({ 
      where: { student: { id: studentId } },
      relations: ['student', 'subject'],
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: number) {
    const activity = await this.activityRepo.findOne({ where: { id }, relations: ['student', 'subject'] });
    if (!activity) throw new NotFoundException('Actividad no encontrada');
    return activity;
  }

  async update(id: number, dto: UpdateActivityDto) {
    const activity = await this.findOne(id);

    if (dto.studentId) {
      const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
      if (!student) throw new NotFoundException('Estudiante no encontrado');
      activity.student = student;
    }

    if (dto.subjectId) {
      const subject = await this.subjectRepo.findOne({ where: { id: dto.subjectId } });
      if (!subject) throw new NotFoundException('Materia no encontrada');
      activity.subject = subject;
    }

    Object.assign(activity, dto);
    const updated = await this.activityRepo.save(activity);
    return {
      message: `Actividad '${updated.titulo}' actualizada para ${updated.student.nombre} (${updated.subject.nombre}).`,
      id: updated.id,
    };
  }

  async remove(id: number) {
    const activity = await this.findOne(id);
    await this.activityRepo.remove(activity);
    return { message: `Actividad '${activity.titulo}' removida satisfactoriamente.`, id };
  }
}
