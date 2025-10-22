import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { StudentsService } from '../students/students.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/invites')
export class InvitesController {
  constructor(private invites: InvitesService, private students: StudentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: { studentId: number; expiresHours?: number }, @Req() req: any) {
    const student = await this.students.findOne(body.studentId);
    if (!student) throw new Error('Student not found');
    const res = await this.invites.create(student as any, req.user?.id, body.expiresHours ?? 72);
    return { message: 'Invite creado', token: res.token, inviteId: res.inviteId };
  }
}
