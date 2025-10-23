import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
export declare class GradesController {
    private readonly gradesService;
    constructor(gradesService: GradesService);
    create(createGradeDto: CreateGradeDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<import("./entities/grade.entity").Grade[]>;
    getGradesByStudent(studentId: string): Promise<import("./entities/grade.entity").Grade[]>;
    getGradesStatistics(studentId: string): Promise<{
        promedio_general: number;
        total_calificaciones: number;
        por_materia: unknown[];
        por_periodo: unknown[];
    }>;
    getGradesByStudentAndSubject(studentId: string, subjectId: string): Promise<import("./entities/grade.entity").Grade[]>;
    getGradesByPeriod(studentId: string, periodo: string): Promise<import("./entities/grade.entity").Grade[]>;
    findOne(id: string): Promise<import("./entities/grade.entity").Grade>;
    update(id: string, updateGradeDto: UpdateGradeDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: number;
    }>;
}
