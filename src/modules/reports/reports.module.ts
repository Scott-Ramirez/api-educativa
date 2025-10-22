import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Behavior } from '../behaviors/entities/behavior.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Activity, Behavior, Subject])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
