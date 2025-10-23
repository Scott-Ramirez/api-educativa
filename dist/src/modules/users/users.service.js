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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const student_entity_1 = require("../students/entities/student.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    userRepo;
    studentRepo;
    constructor(userRepo, studentRepo) {
        this.userRepo = userRepo;
        this.studentRepo = studentRepo;
    }
    async create(dto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({ ...dto, password: hashed });
        const saved = await this.userRepo.save(user);
        return { message: `Usuario ${saved.name} creado satisfactoriamente.`, id: saved.id };
    }
    findAll() {
        return this.userRepo.find({ relations: ['students'] }).then(users => users.map(u => {
            const { password, ...rest } = u;
            return rest;
        }));
    }
    findByEmail(email) {
        return this.userRepo.findOne({ where: { email }, relations: ['students'] });
    }
    findOne(id) {
        return this.userRepo.findOne({ where: { id }, relations: ['students'] }).then(u => {
            if (!u)
                return null;
            const { password, ...rest } = u;
            return rest;
        });
    }
    async update(id, dto) {
        if (dto.password)
            dto.password = await bcrypt.hash(dto.password, 10);
        await this.userRepo.update(id, dto);
        const updated = await this.userRepo.findOne({ where: { id }, relations: ['students'] });
        return { message: `Usuario ${updated?.name ?? id} actualizado satisfactoriamente.`, id };
    }
    async remove(id) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['students'] });
        await this.userRepo.remove(user);
        return { message: `Usuario ${user?.name ?? id} removido satisfactoriamente.`, id };
    }
    async updateProfile(userId, dto) {
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['students'] });
        if (!user) {
            throw new common_1.BadRequestException('Usuario no encontrado');
        }
        const updateData = {};
        if (dto.newPassword) {
            if (!dto.currentPassword) {
                throw new common_1.BadRequestException('Se requiere la contraseña actual para cambiar la contraseña');
            }
            const isValidPassword = await bcrypt.compare(dto.currentPassword, user.password);
            if (!isValidPassword) {
                throw new common_1.UnauthorizedException('Contraseña actual incorrecta');
            }
            updateData.password = await bcrypt.hash(dto.newPassword, 10);
        }
        if (dto.name) {
            updateData.name = dto.name;
        }
        if (dto.email && dto.email !== user.email) {
            const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
            if (existingUser && existingUser.id !== userId) {
                throw new common_1.BadRequestException('El email ya está en uso por otro usuario');
            }
            updateData.email = dto.email;
        }
        if (Object.keys(updateData).length > 0) {
            await this.userRepo.update(userId, updateData);
        }
        const updatedUser = await this.userRepo.findOne({ where: { id: userId }, relations: ['students'] });
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async linkStudentToParent(studentId, parentId) {
        console.log(`🔗 [UsersService] Vinculando estudiante ${studentId} al padre ${parentId}`);
        try {
            const student = await this.studentRepo.findOne({
                where: { id: studentId },
                relations: ['user']
            });
            if (!student) {
                throw new common_1.BadRequestException(`Estudiante con ID ${studentId} no encontrado`);
            }
            const parent = await this.userRepo.findOne({
                where: { id: parentId }
            });
            if (!parent) {
                throw new common_1.BadRequestException(`Usuario padre con ID ${parentId} no encontrado`);
            }
            if (parent.role !== 'PARENT') {
                throw new common_1.BadRequestException(`El usuario ${parentId} no es un padre`);
            }
            student.user = parent;
            await this.studentRepo.save(student);
            console.log(`✅ [UsersService] Estudiante ${student.nombre} vinculado exitosamente al padre ${parent.name}`);
            return {
                message: 'Vinculación exitosa',
                student: student.nombre,
                parent: parent.name
            };
        }
        catch (error) {
            console.error(`❌ [UsersService] Error vinculando estudiante ${studentId} al padre ${parentId}:`, error);
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map