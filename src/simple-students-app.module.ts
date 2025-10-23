import { Module } from '@nestjs/common';
import { BasicHealthController } from './basic-health.controller';

// Crear un controlador simple para Students sin TypeORM
import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('students')
class SimpleStudentsController {
  @Get()
  findAll() {
    return {
      message: 'Students endpoint funcionando',
      data: [],
      count: 0,
      withoutDatabase: true
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      message: `Student ${id} endpoint funcionando`,
      data: { id, name: 'Test Student' },
      withoutDatabase: true
    };
  }

  @Post('upload-photo/:id')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return {
      message: 'Upload endpoint funcionando',
      studentId: id,
      filename: file?.originalname || 'no-file',
      size: file?.size || 0,
      withoutDatabase: true
    };
  }
}

@Module({
  controllers: [BasicHealthController, SimpleStudentsController],
  providers: [
    {
      provide: 'DATABASE_CONFIG',
      useValue: {
        host: process.env.DB_HOST || 'sql10.freesqldatabase.com',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME || 'sql10804152',
        password: process.env.DB_PASSWORD || 'X3ltkbjtPI',
        database: process.env.DB_DATABASE || 'sql10804152',
      }
    },
    {
      provide: 'APP_CONFIG',
      useValue: {
        message: 'API Educativa - Simple Module funcionando',
        timestamp: new Date().toISOString(),
        simpleModule: true,
        hasStudentsEndpoints: true,
        hasFileUpload: true,
        environment: process.env.NODE_ENV || 'production'
      }
    }
  ],
})
export class SimpleStudentsAppModule {}