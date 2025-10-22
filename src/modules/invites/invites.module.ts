import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { Invite } from './entities/invite.entity';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invite]), StudentsModule],
  providers: [InvitesService],
  controllers: [InvitesController],
  exports: [InvitesService],
})
export class InvitesModule {}
