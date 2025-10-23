import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';
export declare class Grade {
    id: number;
    calificacion: number;
    tipo: string;
    descripcion: string;
    fecha: string;
    periodo: string;
    valor_maximo: number;
    observaciones: string;
    created_at: Date;
    student: Student;
    subject: Subject;
}
