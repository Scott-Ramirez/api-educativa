import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private dataSource: DataSource,
  ) {}

  async create(data: CreateStudentDto) {
    const student = this.studentRepository.create(data);
    return await this.studentRepository.save(student);
  }

  async findAll() {
    return await this.studentRepository.find();
  }

  async getStudentsByParent(parentId: number) {
    console.log(`🔍 [StudentsService] Obteniendo hijos del padre ID: ${parentId}`);
    
    try {
      // Buscar estudiantes usando TypeORM con relación
      const students = await this.studentRepository.find({
        where: {
          user: { id: parentId }
        },
        relations: ['user']
      });
      
      console.log(`📊 [StudentsService] ${students.length} hijos encontrados para el padre ${parentId}`);
      
      return students;
    } catch (error) {
      console.error(`❌ [StudentsService] Error obteniendo hijos del padre ${parentId}:`, error);
      throw error;
    }
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Estudiante no encontrado');
    return student;
  }

  async update(id: number, data: UpdateStudentDto) {
    const student = await this.findOne(id);
    Object.assign(student, data);
    return await this.studentRepository.save(student);
  }

  async getStudentRelations(id: number) {
    console.log(`🔍 [StudentsService] Obteniendo relaciones del estudiante ID: ${id}`);
    
    try {
      // Verificar invitaciones
      const invites = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM invites WHERE student_id = ?',
        [id]
      );
      
      // Verificar actividades
      const activities = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM activities WHERE student_id = ?',
        [id]
      );
      
      // Verificar comportamientos
      const behaviors = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM behaviors WHERE student_id = ?',
        [id]
      );
      
      const relations = {
        invites: invites[0]?.count || 0,
        activities: activities[0]?.count || 0,
        behaviors: behaviors[0]?.count || 0,
      };
      
      console.log(`📊 [StudentsService] Relaciones encontradas:`, relations);
      
      return relations;
    } catch (error) {
      console.error(`❌ [StudentsService] Error obteniendo relaciones:`, error);
      throw error;
    }
  }

  async remove(id: number) {
    console.log(`🗑️ [StudentsService] Intentando eliminar estudiante ID: ${id}`);
    
    try {
      // Primero verificar que el estudiante existe
      const student = await this.studentRepository.findOne({ where: { id } });
      
      if (!student) {
        console.log(`❌ [StudentsService] Estudiante ID ${id} no encontrado`);
        throw new NotFoundException('Estudiante no encontrado');
      }
      
      console.log(`✅ [StudentsService] Estudiante encontrado: ${student.nombre}`);
      
      // Usar query SQL directa para manejar las restricciones FK
      console.log(`🔗 [StudentsService] Eliminando con SQL directo...`);
      
      const result = await this.dataSource.query(
        'DELETE FROM students WHERE id = ?',
        [id]
      );
      
      console.log(`✅ [StudentsService] Estudiante eliminado exitosamente`);
      
      return { success: true, message: 'Estudiante eliminado correctamente' };
    } catch (error) {
      console.error(`❌ [StudentsService] Error eliminando estudiante ID ${id}:`, error);
      
      // Si es un error de restricción de clave foránea, dar un mensaje más claro
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
        throw new Error('No se puede eliminar el estudiante porque tiene registros relacionados (invitaciones, actividades, etc.)');
      }
      
      throw error;
    }
  }

  async updateImageUrl(id: number, imageUrl: string, publicId?: string) {
    console.log(`🖼️ [StudentsService] Actualizando URL de imagen para estudiante ID: ${id}`);
    
    try {
      const student = await this.findOne(id);
      student.foto_url = imageUrl;
      
      // Guardar también el public_id de Cloudinary si se proporciona
      if (publicId) {
        student.cloudinary_public_id = publicId;
      }
      
      await this.studentRepository.save(student);
      
      console.log(`✅ [StudentsService] URL de imagen actualizada: ${imageUrl}`);
      console.log(`✅ [StudentsService] Public ID guardado: ${publicId}`);
      return student;
    } catch (error) {
      console.error(`❌ [StudentsService] Error actualizando URL de imagen:`, error);
      throw error;
    }
  }

  async deleteStudentImage(id: number) {
    console.log(`🗑️ [StudentsService] Eliminando imagen del estudiante ID: ${id}`);
    
    try {
      const student = await this.findOne(id);
      
      if (student.foto_url) {
        // Eliminar archivo físico si existe
        try {
          const fileName = student.foto_url.replace('/uploads/students/', '');
          const filePath = join('./uploads/students', fileName);
          await unlink(filePath);
          console.log(`✅ [StudentsService] Archivo de imagen eliminado: ${filePath}`);
        } catch (fileError) {
          console.log(`⚠️ [StudentsService] No se pudo eliminar el archivo físico: ${fileError.message}`);
        }
        
        // Limpiar URL en la base de datos
        student.foto_url = '';
        await this.studentRepository.save(student);
        
        console.log(`✅ [StudentsService] URL de imagen eliminada de la BD`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`❌ [StudentsService] Error eliminando imagen:`, error);
      return false;
    }
  }
}
