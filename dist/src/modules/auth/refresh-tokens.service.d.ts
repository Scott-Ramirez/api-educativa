import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersService } from '../users/users.service';
export declare class RefreshTokensService {
    private readonly repo;
    private readonly usersService;
    constructor(repo: Repository<RefreshToken>, usersService: UsersService);
    createForUser(userId: number, ttlDays?: number): Promise<{
        token: string;
        id: number;
        expiresAt: Date;
    }>;
    findByToken(token: string): Promise<RefreshToken | null>;
    revokeById(id: number): Promise<void>;
    revokeToken(token: string): Promise<void>;
}
