import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { FileUploadService } from './services/file-upload.service';
import { FileResponseService } from './services/file-response.service';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    ConfigModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService, FileUploadService, FileResponseService, CloudinaryService],
  exports: [StudentsService],
})
export class StudentsModule {}
