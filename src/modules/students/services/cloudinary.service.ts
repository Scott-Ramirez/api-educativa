import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private configService: ConfigService) {
    // Configurar Cloudinary con variables de entorno
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    this.logger.log('🌤️ Cloudinary configurado correctamente');
  }

  /**
   * Sube una imagen a Cloudinary
   */
  async uploadImage(
    buffer: Buffer,
    filename: string,
    studentId: number
  ): Promise<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  }> {
    try {
      this.logger.log(`📤 Subiendo imagen para estudiante ${studentId}: ${filename}`);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'educativa-app/students', // Organizar en carpetas
            public_id: `student_${studentId}_${Date.now()}`, // ID único
            transformation: [
              { width: 800, height: 800, crop: 'limit' }, // Redimensionar automáticamente
              { quality: 'auto' }, // Optimización automática
              { fetch_format: 'auto' } // Formato óptimo según navegador
            ],
            tags: ['student', `student_${studentId}`], // Tags para organización
          },
          (error, result) => {
            if (error) {
              this.logger.error(`❌ Error subiendo imagen: ${error.message}`);
              reject(error);
            } else if (result) {
              this.logger.log(`✅ Imagen subida exitosamente: ${result.secure_url}`);
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
              });
            } else {
              reject(new Error('No se recibió resultado de Cloudinary'));
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      this.logger.error(`❌ Error en uploadImage: ${error.message}`);
      throw error;
    }
  }

  /**
   * Elimina una imagen de Cloudinary
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      this.logger.log(`🗑️ Eliminando imagen: ${publicId}`);
      
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        this.logger.log(`✅ Imagen eliminada exitosamente: ${publicId}`);
        return true;
      } else {
        this.logger.warn(`⚠️ No se pudo eliminar la imagen: ${publicId}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`❌ Error eliminando imagen: ${error.message}`);
      return false;
    }
  }

  /**
   * Obtiene información de una imagen
   */
  async getImageInfo(publicId: string): Promise<any> {
    try {
      this.logger.log(`🔍 Obteniendo info de imagen: ${publicId}`);
      
      const result = await cloudinary.api.resource(publicId);
      
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
      };
    } catch (error) {
      this.logger.error(`❌ Error obteniendo info de imagen: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lista todas las imágenes de estudiantes
   */
  async listStudentImages(): Promise<any[]> {
    try {
      this.logger.log('📋 Listando imágenes de estudiantes');
      
      const result = await cloudinary.search
        .expression('folder:educativa-app/students AND tags:student')
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute();

      this.logger.log(`📋 Encontradas ${result.resources.length} imágenes`);
      
      return result.resources.map(resource => ({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        bytes: resource.bytes,
        created_at: resource.created_at,
        tags: resource.tags,
      }));
    } catch (error) {
      this.logger.error(`❌ Error listando imágenes: ${error.message}`);
      throw error;
    }
  }

  /**
   * Genera URL con transformaciones
   */
  generateTransformedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    try {
      const transformations: any[] = [];
      
      if (options.width || options.height) {
        transformations.push({
          width: options.width,
          height: options.height,
          crop: options.crop || 'fill'
        });
      }
      
      if (options.quality) {
        transformations.push({ quality: options.quality });
      }
      
      if (options.format) {
        transformations.push({ fetch_format: options.format });
      }

      return cloudinary.url(publicId, {
        transformation: transformations,
        secure: true
      });
    } catch (error) {
      this.logger.error(`❌ Error generando URL transformada: ${error.message}`);
      throw error;
    }
  }
}