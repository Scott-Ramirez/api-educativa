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
exports.BehaviorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const behavior_entity_1 = require("./entities/behavior.entity");
const student_entity_1 = require("../students/entities/student.entity");
let BehaviorsService = class BehaviorsService {
    behaviorRepo;
    studentRepo;
    constructor(behaviorRepo, studentRepo) {
        this.behaviorRepo = behaviorRepo;
        this.studentRepo = studentRepo;
    }
    async create(dto) {
        const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
        if (!student)
            throw new common_1.NotFoundException('Estudiante no encontrado');
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
    async findByStudent(studentId) {
        return await this.behaviorRepo.find({
            where: { student: { id: studentId } },
            relations: ['student'],
            order: { fecha: 'DESC' }
        });
    }
    async findOne(id) {
        const behavior = await this.behaviorRepo.findOne({ where: { id }, relations: ['student'] });
        if (!behavior)
            throw new common_1.NotFoundException('Registro de comportamiento no encontrado');
        return behavior;
    }
    async update(id, dto) {
        const behavior = await this.findOne(id);
        if (dto.studentId) {
            const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
            if (!student)
                throw new common_1.NotFoundException('Estudiante no encontrado');
            behavior.student = student;
        }
        Object.assign(behavior, dto);
        const updated = await this.behaviorRepo.save(behavior);
        return {
            message: `Registro ${updated.id} para ${updated.student.nombre} actualizado: ${updated.estado} (${updated.fecha}).`,
            id: updated.id,
        };
    }
    async remove(id) {
        const behavior = await this.findOne(id);
        await this.behaviorRepo.remove(behavior);
        return { message: `Registro ${behavior.id} para ${behavior.student.nombre} removido satisfactoriamente.`, id };
    }
};
exports.BehaviorsService = BehaviorsService;
exports.BehaviorsService = BehaviorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(behavior_entity_1.Behavior)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BehaviorsService);
//# sourceMappingURL=behaviors.service.js.map