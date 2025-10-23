import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(createAttendanceDto: CreateAttendanceDto): Promise<{
        message: string;
        id: number;
    }>;
    findAll(): Promise<import("./entities/attendance.entity").Attendance[]>;
    getAttendanceByStudent(studentId: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    getAttendanceStatistics(studentId: string): Promise<{
        total_dias: number;
        dias_presentes: number;
        dias_ausentes: number;
        dias_tardanza: number;
        dias_justificados: number;
        porcentaje_asistencia: number;
        porcentaje_puntualidad: number;
    }>;
    getAttendanceByDateRange(studentId: string, startDate: string, endDate: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    getAttendanceByMonth(studentId: string, year: string, month: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    findOne(id: string): Promise<import("./entities/attendance.entity").Attendance>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: number;
    }>;
}
