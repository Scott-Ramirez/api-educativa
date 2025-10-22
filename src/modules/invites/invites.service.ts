import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from './entities/invite.entity';
import * as crypto from 'crypto';
import { Student } from '../students/entities/student.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
  ) {}

  async create(student: Student, createdBy?: any, expiresHours?: number) {
    const token = crypto.randomBytes(24).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const invite = this.inviteRepo.create({
      codeHash: hash,
      student,
      createdBy,
      expiresAt: expiresHours ? new Date(Date.now() + expiresHours * 3600 * 1000) : undefined,
    });

    await this.inviteRepo.save(invite);
    return { token, inviteId: invite.id };
  }

  async findByToken(token: string) {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const invite = await this.inviteRepo.findOne({ where: { codeHash: hash }, relations: ['student'] });
    return invite;
  }

  async markUsed(invite: Invite, userId: number) {
    invite.used = true;
    invite.usedBy = (userId as any) as any;
    await this.inviteRepo.save(invite);
  }
}
