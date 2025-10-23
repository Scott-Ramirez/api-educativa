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
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grade_entity_1 = require("./entities/grade.entity");
const student_entity_1 = require("../students/entities/student.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
let GradesService = class GradesService {
    gradeRepo;
    studentRepo;
    subjectRepo;
    constructor(gradeRepo, studentRepo, subjectRepo) {
        this.gradeRepo = gradeRepo;
        this.studentRepo = studentRepo;
        this.subjectRepo = subjectRepo;
    }
    async create(dto) {
        const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
        if (!student)
            throw new common_1.NotFoundException('Estudiante no encontrado');
        const subject = await this.subjectRepo.findOne({ where: { id: dto.subjectId } });
        if (!subject)
            throw new common_1.NotFoundException('Materia no encontrada');
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
    async findByStudent(studentId) {
        return await this.gradeRepo.find({
            where: { student: { id: studentId } },
            relations: ['student', 'subject'],
            order: { fecha: 'DESC' }
        });
    }
    async findByStudentAndSubject(studentId, subjectId) {
        return await this.gradeRepo.find({
            where: {
                student: { id: studentId },
                subject: { id: subjectId }
            },
            relations: ['student', 'subject'],
            order: { fecha: 'DESC' }
        });
    }
    async getGradesByPeriod(studentId, periodo) {
        return await this.gradeRepo.find({
            where: {
                student: { id: studentId },
                periodo: periodo
            },
            relations: ['student', 'subject'],
            order: { fecha: 'DESC' }
        });
    }
    async getGradesStatistics(studentId) {
        const grades = await this.findByStudent(studentId);
        if (grades.length === 0) {
            return {
                promedio_general: 0,
                total_calificaciones: 0,
                por_materia: [],
                por_periodo: []
            };
        }
        const promedioGeneral = grades.reduce((sum, grade) => sum + Number(grade.calificacion), 0) / grades.length;
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
        Object.keys(porMateria).forEach(materiaId => {
            const materia = porMateria[materiaId];
            materia.promedio = materia.calificaciones.reduce((sum, cal) => sum + cal, 0) / materia.calificaciones.length;
        });
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
    async findOne(id) {
        const grade = await this.gradeRepo.findOne({ where: { id }, relations: ['student', 'subject'] });
        if (!grade)
            throw new common_1.NotFoundException('Calificación no encontrada');
        return grade;
    }
    async update(id, dto) {
        const grade = await this.findOne(id);
        if (dto.studentId) {
            const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
            if (!student)
                throw new common_1.NotFoundException('Estudiante no encontrado');
            grade.student = student;
        }
        if (dto.subjectId) {
            const subject = await this.subjectRepo.findOne({ where: { id: dto.subjectId } });
            if (!subject)
                throw new common_1.NotFoundException('Materia no encontrada');
            grade.subject = subject;
        }
        Object.assign(grade, dto);
        const updated = await this.gradeRepo.save(grade);
        return {
            message: `Calificación ${updated.calificacion}/${updated.valor_maximo} para ${updated.student.nombre} en ${updated.subject.nombre} actualizada satisfactoriamente.`,
            id: updated.id,
        };
    }
    async remove(id) {
        const grade = await this.findOne(id);
        await this.gradeRepo.remove(grade);
        return {
            message: `Calificación ${grade.calificacion}/${grade.valor_maximo} para ${grade.student.nombre} en ${grade.subject.nombre} removida satisfactoriamente.`,
            id
        };
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grade_entity_1.Grade)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GradesService);
//# sourceMappingURL=grades.service.js.map