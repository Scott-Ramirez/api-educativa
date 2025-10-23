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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const student_entity_1 = require("./entities/student.entity");
let StudentsService = class StudentsService {
    studentRepository;
    dataSource;
    constructor(studentRepository, dataSource) {
        this.studentRepository = studentRepository;
        this.dataSource = dataSource;
    }
    async create(data) {
        const student = this.studentRepository.create(data);
        return await this.studentRepository.save(student);
    }
    async findAll() {
        return await this.studentRepository.find();
    }
    async getStudentsByParent(parentId) {
        console.log(`🔍 [StudentsService] Obteniendo hijos del padre ID: ${parentId}`);
        try {
            const students = await this.studentRepository.find({
                where: {
                    user: { id: parentId }
                },
                relations: ['user']
            });
            console.log(`📊 [StudentsService] ${students.length} hijos encontrados para el padre ${parentId}`);
            return students;
        }
        catch (error) {
            console.error(`❌ [StudentsService] Error obteniendo hijos del padre ${parentId}:`, error);
            throw error;
        }
    }
    async findOne(id) {
        const student = await this.studentRepository.findOne({ where: { id } });
        if (!student)
            throw new common_1.NotFoundException('Estudiante no encontrado');
        return student;
    }
    async update(id, data) {
        const student = await this.findOne(id);
        Object.assign(student, data);
        return await this.studentRepository.save(student);
    }
    async getStudentRelations(id) {
        console.log(`🔍 [StudentsService] Obteniendo relaciones del estudiante ID: ${id}`);
        try {
            const invites = await this.dataSource.query('SELECT COUNT(*) as count FROM invites WHERE student_id = ?', [id]);
            const activities = await this.dataSource.query('SELECT COUNT(*) as count FROM activities WHERE student_id = ?', [id]);
            const behaviors = await this.dataSource.query('SELECT COUNT(*) as count FROM behaviors WHERE student_id = ?', [id]);
            const relations = {
                invites: invites[0]?.count || 0,
                activities: activities[0]?.count || 0,
                behaviors: behaviors[0]?.count || 0,
            };
            console.log(`📊 [StudentsService] Relaciones encontradas:`, relations);
            return relations;
        }
        catch (error) {
            console.error(`❌ [StudentsService] Error obteniendo relaciones:`, error);
            throw error;
        }
    }
    async remove(id) {
        console.log(`🗑️ [StudentsService] Intentando eliminar estudiante ID: ${id}`);
        try {
            const student = await this.studentRepository.findOne({ where: { id } });
            if (!student) {
                console.log(`❌ [StudentsService] Estudiante ID ${id} no encontrado`);
                throw new common_1.NotFoundException('Estudiante no encontrado');
            }
            console.log(`✅ [StudentsService] Estudiante encontrado: ${student.nombre}`);
            console.log(`🔗 [StudentsService] Eliminando con SQL directo...`);
            const result = await this.dataSource.query('DELETE FROM students WHERE id = ?', [id]);
            console.log(`✅ [StudentsService] Estudiante eliminado exitosamente`);
            return { success: true, message: 'Estudiante eliminado correctamente' };
        }
        catch (error) {
            console.error(`❌ [StudentsService] Error eliminando estudiante ID ${id}:`, error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
                throw new Error('No se puede eliminar el estudiante porque tiene registros relacionados (invitaciones, actividades, etc.)');
            }
            throw error;
        }
    }
    async updateImageUrl(id, imageUrl, publicId) {
        console.log(`🖼️ [StudentsService] Actualizando URL de imagen para estudiante ID: ${id}`);
        try {
            const student = await this.findOne(id);
            student.foto_url = imageUrl;
            if (publicId) {
                student.cloudinary_public_id = publicId;
            }
            await this.studentRepository.save(student);
            console.log(`✅ [StudentsService] URL de imagen actualizada: ${imageUrl}`);
            console.log(`✅ [StudentsService] Public ID guardado: ${publicId}`);
            return student;
        }
        catch (error) {
            console.error(`❌ [StudentsService] Error actualizando URL de imagen:`, error);
            throw error;
        }
    }
    async deleteStudentImage(id) {
        console.log(`🗑️ [StudentsService] Eliminando imagen del estudiante ID: ${id}`);
        try {
            const student = await this.findOne(id);
            if (student.foto_url) {
                try {
                    const fileName = student.foto_url.replace('/uploads/students/', '');
                    const filePath = (0, path_1.join)('./uploads/students', fileName);
                    await (0, promises_1.unlink)(filePath);
                    console.log(`✅ [StudentsService] Archivo de imagen eliminado: ${filePath}`);
                }
                catch (fileError) {
                    console.log(`⚠️ [StudentsService] No se pudo eliminar el archivo físico: ${fileError.message}`);
                }
                student.foto_url = '';
                await this.studentRepository.save(student);
                console.log(`✅ [StudentsService] URL de imagen eliminada de la BD`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error(`❌ [StudentsService] Error eliminando imagen:`, error);
            return false;
        }
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], StudentsService);
//# sourceMappingURL=students.service.js.map