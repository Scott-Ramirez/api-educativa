import { Student } from '../../students/entities/student.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    students: Student[];
}
