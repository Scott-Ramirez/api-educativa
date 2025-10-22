import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradeRepo: Repository<Grade>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
  ) {}

  async create(dto: CreateGradeDto) {
    const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Estudiante no encontrado');

    const subject = await this.subjectRepo.findOne({ where: { id: dto.subjectId } });
    if (!subject) throw new NotFoundException('Materia no encontrada');

    const grade = this.gradeRepo.create({
      calificacion: dto.calificacion,
      tipo: dto.tipo,
      descripcion: dto.descripcion,
      fecha: dto.fecha,
      periodo: dto.periodo,
      valor_maximo: dto.valor_maximo || 100,
      observaciones: dto.observaciones,
      student,
      subject,
    });

    const saved = await this.gradeRepo.save(grade);
    return {
      message: `Calificación ${saved.calificacion}/${saved.valor_maximo} para ${saved.student.nombre} en ${saved.subject.nombre} registrada satisfactoriamente.`,
      id: saved.id,
    };
  }

  async findAll() {
    return await this.gradeRepo.find({ relations: ['student', 'subject'] });
  }

  async findByStudent(studentId: number) {
    return await this.gradeRepo.find({ 
      where: { student: { id: studentId } },
      relations: ['student', 'subject'],
      order: { fecha: 'DESC' }
    });
  }

  async findByStudentAndSubject(studentId: number, subjectId: number) {
    return await this.gradeRepo.find({ 
      where: { 
        student: { id: studentId },
        subject: { id: subjectId }
      },
      relations: ['student', 'subject'],
      order: { fecha: 'DESC' }
    });
  }

  async getGradesByPeriod(studentId: number, periodo: string) {
    return await this.gradeRepo.find({ 
      where: { 
        student: { id: studentId },
        periodo: periodo
      },
      relations: ['student', 'subject'],
      order: { fecha: 'DESC' }
    });
  }

  async getGradesStatistics(studentId: number) {
    const grades = await this.findByStudent(studentId);
    
    if (grades.length === 0) {
      return {
        promedio_general: 0,
        total_calificaciones: 0,
        por_materia: [],
        por_periodo: []
      };
    }

    // Calcular promedio general
    const promedioGeneral = grades.reduce((sum, grade) => sum + Number(grade.calificacion), 0) / grades.length;

    // Agrupar por materia
    const porMateria = grades.reduce((acc, grade) => {
      const materiaId = grade.subject.id;
      if (!acc[materiaId]) {
        acc[materiaId] = {
          materia: grade.subject.nombre,
          calificaciones: [],
          promedio: 0
        };
      }
      acc[materiaId].calificaciones.push(Number(grade.calificacion));
      return acc;
    }, {});

    // Calcular promedios por materia
    Object.keys(porMateria).forEach(materiaId => {
      const materia = porMateria[materiaId];
      materia.promedio = materia.calificaciones.reduce((sum, cal) => sum + cal, 0) / materia.calificaciones.length;
    });

    // Agrupar por periodo
    const porPeriodo = grades.reduce((acc, grade) => {
      const periodo = grade.periodo;
      if (!acc[periodo]) {
        acc[periodo] = {
          periodo: periodo,
          calificaciones: [],
          promedio: 0
        };
      }
      acc[periodo].calificaciones.push(Number(grade.calificacion));
      return acc;
    }, {});

    // Calcular promedios por periodo
    Object.keys(porPeriodo).forEach(periodo => {
      const periodoData = porPeriodo[periodo];
      periodoData.promedio = periodoData.calificaciones.reduce((sum, cal) => sum + cal, 0) / periodoData.calificaciones.length;
    });

    return {
      promedio_general: Math.round(promedioGeneral * 100) / 100,
      total_calificaciones: grades.length,
      por_materia: Object.values(porMateria),
      por_periodo: Object.values(porPeriodo)
    };
  }

  async findOne(id: number) {
    const grade = await this.gradeRepo.findOne({ where: { id }, relations: ['student', 'subject'] });
    if (!grade) throw new NotFoundException('Calificación no encontrada');
    return grade;
  }

  async update(id: number, dto: UpdateGradeDto) {
    const grade = await this.findOne(id);

    if (dto.studentId) {
      const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
      if (!student) throw new NotFoundException('Estudiante no encontrado');
      grade.student = student;
    }

    if (dto.subjectId) {
      const subject = await this.subjectRepo.findOne({ where: { id: dto.subjectId } });
      if (!subject) throw new NotFoundException('Materia no encontrada');
      grade.subject = subject;
    }

    Object.assign(grade, dto);
    const updated = await this.gradeRepo.save(grade);
    return {
      message: `Calificación ${updated.calificacion}/${updated.valor_maximo} para ${updated.student.nombre} en ${updated.subject.nombre} actualizada satisfactoriamente.`,
      id: updated.id,
    };
  }

  async remove(id: number) {
    const grade = await this.findOne(id);
    await this.gradeRepo.remove(grade);
    return { 
      message: `Calificación ${grade.calificacion}/${grade.valor_maximo} para ${grade.student.nombre} en ${grade.subject.nombre} removida satisfactoriamente.`, 
      id 
    };
  }
}