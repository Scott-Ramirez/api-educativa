import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
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
    registerParent(body: {
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
    refresh(body: {
        refresh_token: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(body: {
        refresh_token?: string;
    }, req: any): Promise<{
        message: string;
    }>;
    me(req: any): Promise<{
        message: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            student: any;
        };
    }>;
    linkChild(body: {
        inviteCode: string;
    }, req: any): Promise<{
        message: string;
        student: {
            id: number;
            name: string;
        };
    }>;
}
