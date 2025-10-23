import { Student } from '../../students/entities/student.entity';
export declare class Behavior {
    id: number;
    fecha: string;
    estado: string;
    observaciones: string;
    student: Student;
    created_at: Date;
}
