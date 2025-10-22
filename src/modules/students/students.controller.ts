import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  UseGuards, 
  Req, 
  UseInterceptors, 
  UploadedFile, 
  Res,
  ParseIntPipe,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileUploadService } from './services/file-upload.service';
import { FileResponseService } from './services/file-response.service';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly fileUploadService: FileUploadService,
    private readonly fileResponseService: FileResponseService,
  ) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('my-children')
  @Roles('PARENT')
  getMyChildren(@Req() req: any) {
    const parentId = req.user.id;
    return this.studentsService.getStudentsByParent(parentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Get(':id/relations')
  getStudentRelations(@Param('id') id: string) {
    return this.studentsService.getStudentRelations(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }

  @Post(':id/upload-image')
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image', {
    storage: require('multer').memoryStorage(),
    fileFilter: (req, file, cb) => {
      // Delegamos la validación al servicio pero necesitamos hacer la llamada aquí
      const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const fileExtension = require('path').extname(file.originalname).toLowerCase();
      
      const isMimeValid = validMimeTypes.includes(file.mimetype.toLowerCase());
      const isExtensionValid = validExtensions.includes(fileExtension);
      
      if (isMimeValid || isExtensionValid) {
        cb(null, true);
      } else {
        cb(new Error(`Solo se permiten archivos de imagen. MIME recibido: ${file.mimetype}, Extensión: ${fileExtension}`), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  async uploadStudentImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileUploadService.uploadStudentImage(+id, file, this.studentsService);
  }

  @Delete(':id/image')
  @Roles('ADMIN')
  async deleteStudentImage(@Param('id') id: string) {
    const result = await this.studentsService.deleteStudentImage(+id);
    return {
      message: result ? 'Imagen eliminada exitosamente' : 'No se pudo eliminar la imagen',
      success: result,
    };
  }

  @Get('images/list')
  @Roles('ADMIN') 
  async listImages() {
    return this.fileResponseService.listImages();
  }

  @Get('images/test/:filename')
  async testImageAccess(@Param('filename') filename: string) {
    return this.fileResponseService.testImageAccess(filename);
  }

  @Get('images/serve/:filename')
  async serveImage(@Param('filename') filename: string, @Res() res: any) {
    return this.fileResponseService.serveImageFile(filename, res);
  }
}
