import { User } from '../../users/entities/user.entity';
export declare class RefreshToken {
    id: number;
    tokenHash: string;
    user: User;
    expiresAt: Date;
    revoked: boolean;
    createdAt: Date;
}
