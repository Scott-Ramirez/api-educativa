"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const invites_service_1 = require("../invites/invites.service");
const refresh_tokens_service_1 = require("./refresh-tokens.service");
const common_2 = require("@nestjs/common");
let AuthService = class AuthService {
    usersService;
    jwtService;
    invitesService;
    refreshTokensService;
    constructor(usersService, jwtService, invitesService, refreshTokensService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.invitesService = invitesService;
        this.refreshTokensService = refreshTokensService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Contraseña incorrecta');
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        const refresh = await this.refreshTokensService.createForUser(user.id);
        return {
            message: 'Login exitoso',
            access_token: token,
            refresh_token: refresh.token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async registerParent(dto) {
        const { name, email, password, inviteCode } = dto;
        if (!inviteCode)
            throw new common_2.BadRequestException('Invite code required');
        const invite = await this.invitesService.findByToken(inviteCode);
        if (!invite)
            throw new common_2.BadRequestException('Invite inválido');
        if (invite.used)
            throw new common_2.BadRequestException('Invite ya usado');
        if (invite.expiresAt && invite.expiresAt.getTime() < Date.now())
            throw new common_2.BadRequestException('Invite expirado');
        const existing = await this.usersService.findByEmail(email);
        if (existing)
            throw new common_2.BadRequestException('Email ya registrado');
        const created = await this.usersService.create({
            name,
            email,
            password,
            role: 'PARENT'
        });
        if (invite.student?.id) {
            await this.usersService.linkStudentToParent(invite.student.id, created.id);
        }
        await this.invitesService.markUsed(invite, created.id ?? 0);
        const userRecord = await this.usersService.findByEmail(email);
        const payload = { id: userRecord.id, email: userRecord.email, role: userRecord.role };
        const token = this.jwtService.sign(payload);
        const refresh = await this.refreshTokensService.createForUser(userRecord.id);
        return {
            message: 'Registro completado',
            user: {
                id: userRecord.id,
                name: userRecord.name,
                email: userRecord.email,
                role: userRecord.role
            },
            access_token: token,
            refresh_token: refresh.token,
        };
    }
    async refresh(refreshToken) {
        if (!refreshToken)
            throw new common_2.BadRequestException('Refresh token required');
        const found = await this.refreshTokensService.findByToken(refreshToken);
        if (!found || found.revoked || found.expiresAt.getTime() < Date.now())
            throw new common_2.BadRequestException('Refresh token inválido');
        const user = found.user;
        await this.refreshTokensService.revokeById(found.id);
        const newRefresh = await this.refreshTokensService.createForUser(user.id);
        const payload = { id: user.id, email: user.email, role: user.role };
        const access = this.jwtService.sign(payload);
        return { access_token: access, refresh_token: newRefresh.token };
    }
    async logout(refreshToken) {
        if (!refreshToken)
            return { message: 'No token provided' };
        await this.refreshTokensService.revokeToken(refreshToken);
        return { message: 'Logged out' };
    }
    async getCurrentUser(userId) {
        const user = await this.usersService.findOne(userId);
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        return {
            message: 'Usuario autenticado',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                student: user.students?.[0] || null,
            },
        };
    }
    async linkChildToParent(inviteCode, parentId) {
        console.log(`🔗 [AuthService] Vinculando hijo al padre ${parentId} con código: ${inviteCode}`);
        const invite = await this.invitesService.findByToken(inviteCode);
        if (!invite)
            throw new common_2.BadRequestException('Código de invitación inválido');
        if (invite.used)
            throw new common_2.BadRequestException('Código de invitación ya usado');
        if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
            throw new common_2.BadRequestException('Código de invitación expirado');
        }
        if (!invite.student?.id) {
            throw new common_2.BadRequestException('No hay estudiante asociado a este código');
        }
        const parent = await this.usersService.findOne(parentId);
        if (!parent || parent.role !== 'PARENT') {
            throw new common_2.BadRequestException('Solo los padres pueden vincular estudiantes');
        }
        const linkResult = await this.usersService.linkStudentToParent(invite.student.id, parentId);
        await this.invitesService.markUsed(invite, parentId);
        console.log(`✅ [AuthService] Estudiante vinculado exitosamente al padre ${parentId}`);
        return {
            message: 'Estudiante vinculado exitosamente',
            student: {
                id: invite.student.id,
                name: invite.student.nombre,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        invites_service_1.InvitesService,
        refresh_tokens_service_1.RefreshTokensService])
], AuthService);
//# sourceMappingURL=auth.service.js.map