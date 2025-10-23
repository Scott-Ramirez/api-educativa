import { Repository } from 'typeorm';
import { Invite } from './entities/invite.entity';
import { Student } from '../students/entities/student.entity';
export declare class InvitesService {
    private readonly inviteRepo;
    constructor(inviteRepo: Repository<Invite>);
    create(student: Student, createdBy?: any, expiresHours?: number): Promise<{
        token: string;
        inviteId: number;
    }>;
    findByToken(token: string): Promise<Invite | null>;
    markUsed(invite: Invite, userId: number): Promise<void>;
}
