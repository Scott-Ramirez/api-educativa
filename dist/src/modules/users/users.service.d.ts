import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private readonly userRepo;
    private readonly studentRepo;
    constructor(userRepo: Repository<User>, studentRepo: Repository<Student>);
    create(dto: CreateUserDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<any[]>;
    findByEmail(email: string): Promise<User | null>;
    findOne(id: number): Promise<any>;
    update(id: number, dto: UpdateUserDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<any>;
    linkStudentToParent(studentId: number, parentId: number): Promise<{
        message: string;
        student: string;
        parent: string;
    }>;
}
