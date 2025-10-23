import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
export declare class Invite {
    id: number;
    codeHash: string;
    student?: Student;
    createdBy?: User;
    usedBy?: User;
    used: boolean;
    expiresAt?: Date;
    createdAt: Date;
}
