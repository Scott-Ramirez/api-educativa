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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_entity_1 = require("./entities/schedule.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
let SchedulesService = class SchedulesService {
    scheduleRepository;
    subjectRepository;
    constructor(scheduleRepository, subjectRepository) {
        this.scheduleRepository = scheduleRepository;
        this.subjectRepository = subjectRepository;
    }
    async create(dto) {
        const subject = await this.subjectRepository.findOne({ where: { id: dto.subjectId } });
        if (!subject)
            throw new common_1.NotFoundException('Materia no encontrada');
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
    async findOne(id) {
        const schedule = await this.scheduleRepository.findOne({ where: { id }, relations: ['subject'] });
        if (!schedule)
            throw new common_1.NotFoundException('Horario no encontrado');
        return schedule;
    }
    async update(id, dto) {
        const schedule = await this.findOne(id);
        if (dto.subjectId) {
            const subject = await this.subjectRepository.findOne({ where: { id: dto.subjectId } });
            if (!subject)
                throw new common_1.NotFoundException('Materia no encontrada');
            schedule.subject = subject;
        }
        Object.assign(schedule, dto);
        const updated = await this.scheduleRepository.save(schedule);
        return {
            message: `Horario ${updated.id} para ${updated.subject.nombre} actualizado: ${updated.dia} ${updated.hora_inicio}-${updated.hora_fin}.`,
            id: updated.id,
        };
    }
    async remove(id) {
        const schedule = await this.findOne(id);
        await this.scheduleRepository.remove(schedule);
        return { message: `Horario ${schedule.id} para ${schedule.subject.nombre} removido satisfactoriamente.`, id };
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __param(1, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map