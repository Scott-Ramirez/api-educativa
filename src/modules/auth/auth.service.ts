import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { InvitesService } from '../invites/invites.service';
import { RefreshTokensService } from './refresh-tokens.service';
import { UsersModule } from '../users/users.module';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly invitesService: InvitesService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    // create refresh token and store hash
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

  async registerParent(dto: { name: string; email: string; password: string; inviteCode: string }) {
    const { name, email, password, inviteCode } = dto;
    if (!inviteCode) throw new BadRequestException('Invite code required');

    const invite = await this.invitesService.findByToken(inviteCode);
    if (!invite) throw new BadRequestException('Invite inválido');
    if (invite.used) throw new BadRequestException('Invite ya usado');
    if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) throw new BadRequestException('Invite expirado');

    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email ya registrado');

    // 1. Crear usuario PARENT
    const created = await this.usersService.create({ 
      name, 
      email, 
      password, 
      role: 'PARENT' 
    } as any);

    // 2. Vincular el estudiante al padre recién creado
    if (invite.student?.id) {
      await this.usersService.linkStudentToParent(invite.student.id, (created as any).id);
    }

    // 3. Marcar invite usado
    await this.invitesService.markUsed(invite as any, (created as any).id ?? 0);

    // 4. Login automático -> buscar usuario y firmar token
    const userRecord = await this.usersService.findByEmail(email);
    const payload = { id: (userRecord as any).id, email: (userRecord as any).email, role: (userRecord as any).role };
    const token = this.jwtService.sign(payload);

    // 5. Create refresh token and store hash
    const refresh = await this.refreshTokensService.createForUser((userRecord as any).id);

    return {
      message: 'Registro completado',
      user: { 
        id: (userRecord as any).id, 
        name: (userRecord as any).name, 
        email: (userRecord as any).email, 
        role: (userRecord as any).role 
      },
      access_token: token,
      refresh_token: refresh.token,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Refresh token required');
    const found = await this.refreshTokensService.findByToken(refreshToken);
    if (!found || found.revoked || found.expiresAt.getTime() < Date.now()) throw new BadRequestException('Refresh token inválido');

    const user = found.user as any;
    // rotate: revoke old, create new
    await this.refreshTokensService.revokeById(found.id);
    const newRefresh = await this.refreshTokensService.createForUser(user.id);

    const payload = { id: user.id, email: user.email, role: user.role };
    const access = this.jwtService.sign(payload);
    return { access_token: access, refresh_token: newRefresh.token };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return { message: 'No token provided' };
    await this.refreshTokensService.revokeToken(refreshToken);
    return { message: 'Logged out' };
  }

  async getCurrentUser(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    return {
      message: 'Usuario autenticado',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        student: user.students?.[0] || null, // Para padres, devolver el primer estudiante
      },
    };
  }

  async linkChildToParent(inviteCode: string, parentId: number) {
    console.log(`🔗 [AuthService] Vinculando hijo al padre ${parentId} con código: ${inviteCode}`);

    // 1. Validar el código de invitación
    const invite = await this.invitesService.findByToken(inviteCode);
    if (!invite) throw new BadRequestException('Código de invitación inválido');
    if (invite.used) throw new BadRequestException('Código de invitación ya usado');
    if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Código de invitación expirado');
    }

    if (!invite.student?.id) {
      throw new BadRequestException('No hay estudiante asociado a este código');
    }

    // 2. Verificar que el usuario sea PARENT
    const parent = await this.usersService.findOne(parentId);
    if (!parent || parent.role !== 'PARENT') {
      throw new BadRequestException('Solo los padres pueden vincular estudiantes');
    }

    // 3. Vincular el estudiante al padre
    const linkResult = await this.usersService.linkStudentToParent(invite.student.id, parentId);

    // 4. Marcar el invite como usado
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
}
