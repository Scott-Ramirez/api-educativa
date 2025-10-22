import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BehaviorsService } from './behaviors.service';
import { BehaviorsController } from './behaviors.controller';
import { Behavior } from './entities/behavior.entity';
import { Student } from '../students/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Behavior, Student])],
  controllers: [BehaviorsController],
  providers: [BehaviorsService],
})
export class BehaviorsModule {}
