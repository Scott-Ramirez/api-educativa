"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const student_entity_1 = require("../students/entities/student.entity");
let AttendanceService = class AttendanceService {
    attendanceRepo;
    studentRepo;
    constructor(attendanceRepo, studentRepo) {
        this.attendanceRepo = attendanceRepo;
        this.studentRepo = studentRepo;
    }
    async create(dto) {
        const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
        if (!student)
            throw new common_1.NotFoundException('Estudiante no encontrado');
        const existing = await this.attendanceRepo.findOne({
            where: {
                student: { id: dto.studentId },
                fecha: dto.fecha
            }
        });
        if (existing) {
            throw new common_1.NotFoundException(`Ya existe un registro de asistencia para ${student.nombre} en la fecha ${dto.fecha}`);
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
    async findByStudent(studentId) {
        return await this.attendanceRepo.find({
            where: { student: { id: studentId } },
            relations: ['student'],
            order: { fecha: 'DESC' }
        });
    }
    async findByStudentAndDateRange(studentId, startDate, endDate) {
        return await this.attendanceRepo
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.student', 'student')
            .where('student.id = :studentId', { studentId })
            .andWhere('attendance.fecha >= :startDate', { startDate })
            .andWhere('attendance.fecha <= :endDate', { endDate })
            .orderBy('attendance.fecha', 'DESC')
            .getMany();
    }
    async getAttendanceStatistics(studentId) {
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
    async getAttendanceByMonth(studentId, year, month) {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        return await this.findByStudentAndDateRange(studentId, startDate, endDate);
    }
    async findOne(id) {
        const attendance = await this.attendanceRepo.findOne({ where: { id }, relations: ['student'] });
        if (!attendance)
            throw new common_1.NotFoundException('Registro de asistencia no encontrado');
        return attendance;
    }
    async update(id, dto) {
        const attendance = await this.findOne(id);
        if (dto.studentId) {
            const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
            if (!student)
                throw new common_1.NotFoundException('Estudiante no encontrado');
            attendance.student = student;
        }
        Object.assign(attendance, dto);
        const updated = await this.attendanceRepo.save(attendance);
        return {
            message: `Asistencia actualizada para ${updated.student.nombre} (${updated.fecha}): ${updated.estado}.`,
            id: updated.id,
        };
    }
    async remove(id) {
        const attendance = await this.findOne(id);
        await this.attendanceRepo.remove(attendance);
        return {
            message: `Registro de asistencia para ${attendance.student.nombre} (${attendance.fecha}) removido satisfactoriamente.`,
            id
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map