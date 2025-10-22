import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async create(dto: CreateAttendanceDto) {
    const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Estudiante no encontrado');

    // Verificar si ya existe un registro para esa fecha
    const existing = await this.attendanceRepo.findOne({
      where: {
        student: { id: dto.studentId },
        fecha: dto.fecha
      }
    });

    if (existing) {
      throw new NotFoundException(`Ya existe un registro de asistencia para ${student.nombre} en la fecha ${dto.fecha}`);
    }

    const attendance = this.attendanceRepo.create({
      fecha: dto.fecha,
      estado: dto.estado,
      hora_llegada: dto.hora_llegada,
      justificacion: dto.justificacion,
      observaciones: dto.observaciones,
      student,
    });

    const saved = await this.attendanceRepo.save(attendance);
    return {
      message: `Asistencia registrada para ${saved.student.nombre} (${saved.fecha}): ${saved.estado}.`,
      id: saved.id,
    };
  }

  async findAll() {
    return await this.attendanceRepo.find({ relations: ['student'] });
  }

  async findByStudent(studentId: number) {
    return await this.attendanceRepo.find({ 
      where: { student: { id: studentId } },
      relations: ['student'],
      order: { fecha: 'DESC' }
    });
  }

  async findByStudentAndDateRange(studentId: number, startDate: string, endDate: string) {
    return await this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .where('student.id = :studentId', { studentId })
      .andWhere('attendance.fecha >= :startDate', { startDate })
      .andWhere('attendance.fecha <= :endDate', { endDate })
      .orderBy('attendance.fecha', 'DESC')
      .getMany();
  }

  async getAttendanceStatistics(studentId: number) {
    const attendances = await this.findByStudent(studentId);
    
    if (attendances.length === 0) {
      return {
        total_dias: 0,
        dias_presentes: 0,
        dias_ausentes: 0,
        dias_tardanza: 0,
        dias_justificados: 0,
        porcentaje_asistencia: 0,
        porcentaje_puntualidad: 0
      };
    }

    const presente = attendances.filter(a => a.estado === 'PRESENTE').length;
    const ausente = attendances.filter(a => a.estado === 'AUSENTE').length;
    const tardanza = attendances.filter(a => a.estado === 'TARDANZA').length;
    const justificado = attendances.filter(a => a.estado === 'JUSTIFICADO').length;

    const totalDias = attendances.length;
    const diasAsistencia = presente + tardanza + justificado;
    const diasPuntuales = presente + justificado;

    return {
      total_dias: totalDias,
      dias_presentes: presente,
      dias_ausentes: ausente,
      dias_tardanza: tardanza,
      dias_justificados: justificado,
      porcentaje_asistencia: Math.round((diasAsistencia / totalDias) * 100),
      porcentaje_puntualidad: Math.round((diasPuntuales / totalDias) * 100)
    };
  }

  async getAttendanceByMonth(studentId: number, year: number, month: number) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Último día del mes

    return await this.findByStudentAndDateRange(studentId, startDate, endDate);
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepo.findOne({ where: { id }, relations: ['student'] });
    if (!attendance) throw new NotFoundException('Registro de asistencia no encontrado');
    return attendance;
  }

  async update(id: number, dto: UpdateAttendanceDto) {
    const attendance = await this.findOne(id);

    if (dto.studentId) {
      const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
      if (!student) throw new NotFoundException('Estudiante no encontrado');
      attendance.student = student;
    }

    Object.assign(attendance, dto);
    const updated = await this.attendanceRepo.save(attendance);
    return {
      message: `Asistencia actualizada para ${updated.student.nombre} (${updated.fecha}): ${updated.estado}.`,
      id: updated.id,
    };
  }

  async remove(id: number) {
    const attendance = await this.findOne(id);
    await this.attendanceRepo.remove(attendance);
    return { 
      message: `Registro de asistencia para ${attendance.student.nombre} (${attendance.fecha}) removido satisfactoriamente.`, 
      id 
    };
  }
}