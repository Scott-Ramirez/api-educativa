import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Student)
        private readonly studentRepo: Repository<Student>,
    ) { }

    async create(dto: CreateUserDto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({ ...dto, password: hashed });
        const saved = await this.userRepo.save(user);
        return { message: `Usuario ${saved.name} creado satisfactoriamente.`, id: saved.id };
    }

    findAll() {
        return this.userRepo.find({ relations: ['students'] }).then(users =>
            users.map(u => {
                const { password, ...rest } = u as any;
                return rest;
            }),
        );
    }

    findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email }, relations: ['students'] });
    }


    findOne(id: number) {
        return this.userRepo.findOne({ where: { id }, relations: ['students'] }).then(u => {
            if (!u) return null;
            const { password, ...rest } = u as any;
            return rest;
        });
    }

    async update(id: number, dto: UpdateUserDto) {
        if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
        await this.userRepo.update(id, dto);
        const updated = await this.userRepo.findOne({ where: { id }, relations: ['students'] });
        return { message: `Usuario ${updated?.name ?? id} actualizado satisfactoriamente.`, id };
    }

    async remove(id: number) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['students'] });
        await this.userRepo.remove(user as any);
        return { message: `Usuario ${user?.name ?? id} removido satisfactoriamente.`, id };
    }

    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['students'] });
        if (!user) {
            throw new BadRequestException('Usuario no encontrado');
        }

        const updateData: Partial<User> = {};

        // Si se va a cambiar la contraseña, validar la contraseña actual
        if (dto.newPassword) {
            if (!dto.currentPassword) {
                throw new BadRequestException('Se requiere la contraseña actual para cambiar la contraseña');
            }

            const isValidPassword = await bcrypt.compare(dto.currentPassword, user.password);
            if (!isValidPassword) {
                throw new UnauthorizedException('Contraseña actual incorrecta');
            }

            updateData.password = await bcrypt.hash(dto.newPassword, 10);
        }

        // Actualizar nombre si se proporciona
        if (dto.name) {
            updateData.name = dto.name;
        }

        // Actualizar email si se proporciona
        if (dto.email && dto.email !== user.email) {
            // Verificar que el email no esté en uso por otro usuario
            const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
            if (existingUser && existingUser.id !== userId) {
                throw new BadRequestException('El email ya está en uso por otro usuario');
            }
            updateData.email = dto.email;
        }

        // Si hay datos para actualizar, actualizarlos
        if (Object.keys(updateData).length > 0) {
            await this.userRepo.update(userId, updateData);
        }

        // Devolver el usuario actualizado sin la contraseña
        const updatedUser = await this.userRepo.findOne({ where: { id: userId }, relations: ['students'] });
        const { password, ...userWithoutPassword } = updatedUser as any;
        
        return userWithoutPassword;
    }

    async linkStudentToParent(studentId: number, parentId: number) {
        console.log(`🔗 [UsersService] Vinculando estudiante ${studentId} al padre ${parentId}`);
        
        try {
            // Buscar el estudiante
            const student = await this.studentRepo.findOne({ 
                where: { id: studentId },
                relations: ['user']
            });
            
            if (!student) {
                throw new BadRequestException(`Estudiante con ID ${studentId} no encontrado`);
            }
            
            // Buscar el padre
            const parent = await this.userRepo.findOne({ 
                where: { id: parentId }
            });
            
            if (!parent) {
                throw new BadRequestException(`Usuario padre con ID ${parentId} no encontrado`);
            }
            
            // Verificar que el usuario sea PARENT
            if (parent.role !== 'PARENT') {
                throw new BadRequestException(`El usuario ${parentId} no es un padre`);
            }
            
            // Vincular el estudiante al padre
            student.user = parent;
            await this.studentRepo.save(student);
            
            console.log(`✅ [UsersService] Estudiante ${student.nombre} vinculado exitosamente al padre ${parent.name}`);
            
            return {
                message: 'Vinculación exitosa',
                student: student.nombre,
                parent: parent.name
            };
        } catch (error) {
            console.error(`❌ [UsersService] Error vinculando estudiante ${studentId} al padre ${parentId}:`, error);
            throw error;
        }
    }
}
