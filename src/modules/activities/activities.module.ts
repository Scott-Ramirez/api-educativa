import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Activity } from './entities/activity.entity';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Student, Subject])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
