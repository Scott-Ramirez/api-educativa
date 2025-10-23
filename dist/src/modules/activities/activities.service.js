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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_entity_1 = require("./entities/activity.entity");
const student_entity_1 = require("../students/entities/student.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
let ActivitiesService = class ActivitiesService {
    activityRepo;
    studentRepo;
    subjectRepo;
    constructor(activityRepo, studentRepo, subjectRepo) {
        this.activityRepo = activityRepo;
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
    async findByStudent(studentId) {
        return await this.activityRepo.find({
            where: { student: { id: studentId } },
            relations: ['student', 'subject'],
            order: { fecha: 'DESC' }
        });
    }
    async findOne(id) {
        const activity = await this.activityRepo.findOne({ where: { id }, relations: ['student', 'subject'] });
        if (!activity)
            throw new common_1.NotFoundException('Actividad no encontrada');
        return activity;
    }
    async update(id, dto) {
        const activity = await this.findOne(id);
        if (dto.studentId) {
            const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
            if (!student)
                throw new common_1.NotFoundException('Estudiante no encontrado');
            activity.student = student;
        }
        if (dto.subjectId) {
            const subject = await this.subjectRepo.findOne({ where: { id: dto.subjectId } });
            if (!subject)
                throw new common_1.NotFoundException('Materia no encontrada');
            activity.subject = subject;
        }
        Object.assign(activity, dto);
        const updated = await this.activityRepo.save(activity);
        return {
            message: `Actividad '${updated.titulo}' actualizada para ${updated.student.nombre} (${updated.subject.nombre}).`,
            id: updated.id,
        };
    }
    async remove(id) {
        const activity = await this.findOne(id);
        await this.activityRepo.remove(activity);
        return { message: `Actividad '${activity.titulo}' removida satisfactoriamente.`, id };
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map