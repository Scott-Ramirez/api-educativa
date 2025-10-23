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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subject_entity_1 = require("./entities/subject.entity");
let SubjectsService = class SubjectsService {
    subjectRepository;
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async create(data) {
        const subject = this.subjectRepository.create(data);
        const saved = await this.subjectRepository.save(subject);
        return { message: `La materia ${saved.nombre} se ha creado satisfactoriamente.`, id: saved.id };
    }
    async findAll() {
        return await this.subjectRepository.find();
    }
    async findOne(id) {
        const subject = await this.subjectRepository.findOne({ where: { id } });
        if (!subject)
            throw new common_1.NotFoundException('Materia no encontrada');
        return subject;
    }
    async update(id, data) {
        const subject = await this.findOne(id);
        Object.assign(subject, data);
        const updated = await this.subjectRepository.save(subject);
        return { message: `La materia ${updated.nombre} se ha actualizado satisfactoriamente.`, id: updated.id };
    }
    async remove(id) {
        const subject = await this.findOne(id);
        await this.subjectRepository.remove(subject);
        return { message: `La materia ${subject.nombre} se ha removido satisfactoriamente.`, id };
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map