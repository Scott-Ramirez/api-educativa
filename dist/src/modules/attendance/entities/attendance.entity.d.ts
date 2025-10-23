import { Student } from '../../students/entities/student.entity';
export declare class Attendance {
    id: number;
    fecha: string;
    estado: string;
    hora_llegada: string;
    justificacion: string;
    observaciones: string;
    created_at: Date;
    student: Student;
}
