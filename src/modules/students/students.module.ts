import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { FileUploadService } from './services/file-upload.service';
import { FileResponseService } from './services/file-response.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentsService, FileUploadService, FileResponseService],
  exports: [StudentsService],
})
export class StudentsModule {}
