import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';
export declare class GradesService {
    private gradeRepo;
    private studentRepo;
    private subjectRepo;
    constructor(gradeRepo: Repository<Grade>, studentRepo: Repository<Student>, subjectRepo: Repository<Subject>);
    create(dto: CreateGradeDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<Grade[]>;
    findByStudent(studentId: number): Promise<Grade[]>;
    findByStudentAndSubject(studentId: number, subjectId: number): Promise<Grade[]>;
    getGradesByPeriod(studentId: number, periodo: string): Promise<Grade[]>;
    getGradesStatistics(studentId: number): Promise<{
        promedio_general: number;
        total_calificaciones: number;
        por_materia: unknown[];
        por_periodo: unknown[];
    }>;
    findOne(id: number): Promise<Grade>;
    update(id: number, dto: UpdateGradeDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
