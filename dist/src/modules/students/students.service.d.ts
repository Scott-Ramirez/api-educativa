import { Repository, DataSource } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsService {
    private studentRepository;
    private dataSource;
    constructor(studentRepository: Repository<Student>, dataSource: DataSource);
    create(data: CreateStudentDto): Promise<Student>;
    findAll(): Promise<Student[]>;
    getStudentsByParent(parentId: number): Promise<Student[]>;
    findOne(id: number): Promise<Student>;
    update(id: number, data: UpdateStudentDto): Promise<Student>;
    getStudentRelations(id: number): Promise<{
        invites: any;
        activities: any;
        behaviors: any;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateImageUrl(id: number, imageUrl: string, publicId?: string): Promise<Student>;
    deleteStudentImage(id: number): Promise<boolean>;
}
