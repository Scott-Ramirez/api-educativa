import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
    private readonly usersService: UsersService,
  ) {}

  async createForUser(userId: number, ttlDays = 30) {
    const token = crypto.randomBytes(64).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.findOne(userId as any);
    if (!user) throw new BadRequestException('User not found');

    const expiresAt = new Date(Date.now() + ttlDays * 24 * 3600 * 1000);
    const entity = this.repo.create({ tokenHash, user: (user as any), expiresAt });
    await this.repo.save(entity);
    return { token, id: entity.id, expiresAt };
  }

  async findByToken(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.repo.findOne({ where: { tokenHash } });
  }

  async revokeById(id: number) {
    await this.repo.update({ id }, { revoked: true });
  }

  async revokeToken(token: string) {
    const r = await this.findByToken(token);
    if (r) await this.revokeById(r.id);
  }
}
