import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InvitesService } from '../invites/invites.service';
import { RefreshTokensService } from './refresh-tokens.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly invitesService;
    private readonly refreshTokensService;
    constructor(usersService: UsersService, jwtService: JwtService, invitesService: InvitesService, refreshTokensService: RefreshTokensService);
    validateUser(email: string, password: string): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        students: import("../students/entities/student.entity").Student[];
    } | null>;
    login(email: string, password: string): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    registerParent(dto: {
        name: string;
        email: string;
        password: string;
        inviteCode: string;
    }): Promise<{
        message: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(refreshToken?: string): Promise<{
        message: string;
    }>;
    getCurrentUser(userId: number): Promise<{
        message: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            student: any;
        };
    }>;
    linkChildToParent(inviteCode: string, parentId: number): Promise<{
        message: string;
        student: {
            id: number;
            name: string;
        };
    }>;
}
