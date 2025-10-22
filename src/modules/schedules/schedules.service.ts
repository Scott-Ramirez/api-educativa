import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Subject } from '../subjects/entities/subject.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(dto: CreateScheduleDto) {
    const subject = await this.subjectRepository.findOne({ where: { id: dto.subjectId } });
    if (!subject) throw new NotFoundException('Materia no encontrada');

    const schedule = this.scheduleRepository.create({
      dia: dto.dia,
      hora_inicio: dto.hora_inicio,
      hora_fin: dto.hora_fin,
      subject,
    });
    const saved = await this.scheduleRepository.save(schedule);
    return {
      message: `Horario para ${subject.nombre} el ${saved.dia} de ${saved.hora_inicio} a ${saved.hora_fin} creado satisfactoriamente.`,
      id: saved.id,
    };
  }

  async findAll() {
    return await this.scheduleRepository.find({ relations: ['subject'] });
  }

  async findOne(id: number) {
    const schedule = await this.scheduleRepository.findOne({ where: { id }, relations: ['subject'] });
    if (!schedule) throw new NotFoundException('Horario no encontrado');
    return schedule;
  }

  async update(id: number, dto: UpdateScheduleDto) {
    const schedule = await this.findOne(id);

    if (dto.subjectId) {
      const subject = await this.subjectRepository.findOne({ where: { id: dto.subjectId } });
      if (!subject) throw new NotFoundException('Materia no encontrada');
      schedule.subject = subject;
    }

    Object.assign(schedule, dto);
    const updated = await this.scheduleRepository.save(schedule);
    return {
      message: `Horario ${updated.id} para ${updated.subject.nombre} actualizado: ${updated.dia} ${updated.hora_inicio}-${updated.hora_fin}.`,
      id: updated.id,
    };
  }

  async remove(id: number) {
    const schedule = await this.findOne(id);
    await this.scheduleRepository.remove(schedule);
    return { message: `Horario ${schedule.id} para ${schedule.subject.nombre} removido satisfactoriamente.`, id };
  }
}
