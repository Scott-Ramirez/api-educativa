import { Injectable, Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Configuración de Multer para subida de imágenes de estudiantes
   */
  getImageUploadOptions(): MulterOptions {
    return {
      storage: diskStorage({
        destination: this.getUploadDestination.bind(this),
        filename: this.generateUniqueFilename.bind(this),
      }),
      fileFilter: this.validateImageFile.bind(this),
      limits: {
        fileSize: this.getMaxFileSize(),
      },
    };
  }

  /**
   * Determina el directorio de destino para archivos subidos
   */
  private getUploadDestination(req: any, file: any, callback: any): void {
    const uploadDir = this.isProduction() 
      ? '/tmp/uploads/students' 
      : './uploads/students';
    
    this.ensureDirectoryExists(uploadDir);
    callback(null, uploadDir);
  }

  /**
   * Genera un nombre único para el archivo
   */
  private generateUniqueFilename(req: any, file: any, callback: any): void {
    const timestamp = Date.now();
    const extension = extname(file.originalname);
    const studentId = req.params.id;
    const uniqueName = `student_${studentId}_${timestamp}${extension}`;
    
    this.logger.log(`📄 Generando nombre de archivo: ${uniqueName}`);
    callback(null, uniqueName);
  }

  /**
   * Valida que el archivo sea una imagen
   */
  private validateImageFile(req: any, file: any, callback: any): void {
    this.logger.log('🔍 Validando archivo:');
    this.logger.log(`📄 Nombre original: ${file.originalname}`);
    this.logger.log(`🎭 MIME type: ${file.mimetype}`);
    
    const validMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = extname(file.originalname).toLowerCase();
    
    const isMimeValid = validMimeTypes.includes(file.mimetype.toLowerCase());
    const isExtensionValid = validExtensions.includes(fileExtension);
    
    this.logger.log(`✅ MIME válido: ${isMimeValid}`);
    this.logger.log(`✅ Extensión válida: ${isExtensionValid}`);
    
    if (isMimeValid || isExtensionValid) {
      this.logger.log('✅ Archivo aceptado');
      callback(null, true);
    } else {
      this.logger.error('❌ Archivo rechazado - Tipo no permitido');
      const error = new Error(
        `Solo se permiten archivos de imagen. MIME recibido: ${file.mimetype}, Extensión: ${fileExtension}`
      );
      callback(error, false);
    }
  }

  /**
   * Verifica si el archivo existe en el sistema
   */
  fileExists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      this.logger.error(`❌ Error verificando archivo: ${error.message}`);
      return false;
    }
  }

  /**
   * Sube la imagen de un estudiante a Cloudinary
   */
  async uploadStudentImage(
    studentId: number, 
    file: Express.Multer.File, 
    studentsService: any
  ) {
    this.logger.log(`📤 Iniciando upload de imagen para estudiante: ${studentId}`);
    this.logger.log(`📄 Archivo recibido: ${file ? 'SÍ' : 'NO'}`);
    
    if (!file) {
      this.logger.error('❌ No se proporcionó archivo');
      throw new Error('No se proporcionó archivo de imagen');
    }

    try {
      // Subir a Cloudinary
      const cloudinaryResult = await this.cloudinaryService.uploadImage(
        file.buffer,
        file.originalname,
        studentId
      );

      this.logger.log(`✅ Imagen subida a Cloudinary: ${cloudinaryResult.secure_url}`);

      // Actualizar URL en base de datos
      const imageUrl = cloudinaryResult.secure_url;
      await studentsService.updateImageUrl(studentId, imageUrl, cloudinaryResult.public_id);
      
      this.logger.log(`✅ URL actualizada en BD: ${imageUrl}`);
      
      return {
        message: 'Imagen subida exitosamente a Cloudinary',
        imageUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
        size: cloudinaryResult.bytes,
      };
    } catch (error) {
      this.logger.error(`❌ Error subiendo imagen: ${error.message}`);
      throw new Error(`Error subiendo imagen: ${error.message}`);
    }
  }

  /**
   * Elimina la imagen de un estudiante de Cloudinary
   */
  async deleteStudentImage(
    studentId: number,
    publicId: string,
    studentsService: any
  ): Promise<boolean> {
    try {
      this.logger.log(`🗑️ Eliminando imagen del estudiante ${studentId}: ${publicId}`);
      
      // Eliminar de Cloudinary
      const deleted = await this.cloudinaryService.deleteImage(publicId);
      
      if (deleted) {
        // Actualizar BD para quitar la URL
        await studentsService.updateImageUrl(studentId, null);
        this.logger.log(`✅ Imagen eliminada y BD actualizada`);
        return true;
      } else {
        this.logger.warn(`⚠️ No se pudo eliminar la imagen de Cloudinary`);
        return false;
      }
    } catch (error) {
      this.logger.error(`❌ Error eliminando imagen: ${error.message}`);
      return false;
    }
  }

  /**
   * Elimina un archivo del sistema
   */
  deleteFile(filePath: string): boolean {
    try {
      if (this.fileExists(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`🗑️ Archivo eliminado: ${filePath}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`❌ Error eliminando archivo: ${error.message}`);
      return false;
    }
  }

  /**
   * Lista archivos en un directorio
   */
  listFiles(directory: string): string[] {
    try {
      if (!fs.existsSync(directory)) {
        return [];
      }
      
      const files = fs.readdirSync(directory);
      return files.filter(file => this.isImageFile(file));
    } catch (error) {
      this.logger.error(`❌ Error listando archivos: ${error.message}`);
      return [];
    }
  }

  /**
   * Verifica si está en producción
   */
  private isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Obtiene el tamaño máximo de archivo permitido
   */
  private getMaxFileSize(): number {
    return 5 * 1024 * 1024; // 5MB
  }

  /**
   * Asegura que el directorio existe
   */
  private ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
      this.logger.log(`📁 Directorio creado: ${directory}`);
    }
  }

  /**
   * Verifica si un archivo es una imagen por extensión
   */
  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }
}