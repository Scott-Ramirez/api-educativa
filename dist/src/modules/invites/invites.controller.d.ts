import { InvitesService } from './invites.service';
import { StudentsService } from '../students/students.service';
export declare class InvitesController {
    private invites;
    private students;
    constructor(invites: InvitesService, students: StudentsService);
    create(body: {
        studentId: number;
        expiresHours?: number;
    }, req: any): Promise<{
        message: string;
        token: string;
        inviteId: number;
    }>;
}
