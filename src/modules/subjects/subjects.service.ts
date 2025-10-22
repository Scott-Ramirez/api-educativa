import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(data: CreateSubjectDto) {
    const subject = this.subjectRepository.create(data);
    const saved = await this.subjectRepository.save(subject);
    return { message: `La materia ${saved.nombre} se ha creado satisfactoriamente.`, id: saved.id };
  }

  async findAll() {
    return await this.subjectRepository.find();
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) throw new NotFoundException('Materia no encontrada');
    return subject;
  }

  async update(id: number, data: UpdateSubjectDto) {
    const subject = await this.findOne(id);
    Object.assign(subject, data);
    const updated = await this.subjectRepository.save(subject);
    return { message: `La materia ${updated.nombre} se ha actualizado satisfactoriamente.`, id: updated.id };
  }

  async remove(id: number) {
    const subject = await this.findOne(id);
    await this.subjectRepository.remove(subject);
    return { message: `La materia ${subject.nombre} se ha removido satisfactoriamente.`, id };
  }
}
