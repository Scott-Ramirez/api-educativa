import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Student } from '../students/entities/student.entity';
export declare class AttendanceService {
    private attendanceRepo;
    private studentRepo;
    constructor(attendanceRepo: Repository<Attendance>, studentRepo: Repository<Student>);
    create(dto: CreateAttendanceDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<Attendance[]>;
    findByStudent(studentId: number): Promise<Attendance[]>;
    findByStudentAndDateRange(studentId: number, startDate: string, endDate: string): Promise<Attendance[]>;
    getAttendanceStatistics(studentId: number): Promise<{
        total_dias: number;
        dias_presentes: number;
        dias_ausentes: number;
        dias_tardanza: number;
        dias_justificados: number;
        porcentaje_asistencia: number;
        porcentaje_puntualidad: number;
    }>;
    getAttendanceByMonth(studentId: number, year: number, month: number): Promise<Attendance[]>;
    findOne(id: number): Promise<Attendance>;
    update(id: number, dto: UpdateAttendanceDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
