import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';
export declare class Activity {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    nota: number;
    student: Student;
    subject: Subject;
    created_at: Date;
}
