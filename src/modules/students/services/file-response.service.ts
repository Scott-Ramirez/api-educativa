import { Injectable, Logger, NotFoundException, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileResponseService {
  private readonly logger = new Logger(FileResponseService.name);

  /**
   * Sirve un archivo de imagen con headers apropiados
   */
  async serveImageFile(filename: string, response: Response): Promise<void> {
    const filePath = this.getImageFilePath(filename);
    
    if (!this.fileExists(filePath)) {
      throw new NotFoundException('Imagen no encontrada');
    }

    const stats = fs.statSync(filePath);
    const contentType = this.getContentType(filename);
    
    this.setImageHeaders(response, contentType, stats.size);
    
    this.logger.log(`📤 Sirviendo imagen: ${filename}`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(response);
  }

  /**
   * Obtiene información de test para un archivo
   */
  getFileTestInfo(filename: string) {
    const filePath = this.getImageFilePath(filename);
    const exists = this.fileExists(filePath);
    const stats = exists ? fs.statSync(filePath) : null;

    return {
      message: 'Test de acceso a imagen',
      filename,
      filePath,
      exists,
      size: stats?.size || null,
      staticUrl: `/uploads/students/${filename}`,
    };
  }

  /**
   * Lista todas las imágenes en el directorio de estudiantes
   */
  listStudentImages() {
    const uploadsDir = this.getStudentsDirectory();
    
    if (!fs.existsSync(uploadsDir)) {
      return {
        message: 'Directorio no encontrado',
        directory: uploadsDir,
        images: [],
        count: 0,
      };
    }

    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => this.isImageFile(file));
    
    this.logger.log(`🖼️ Imágenes encontradas: ${imageFiles.length}`);
    
    return {
      message: 'Lista de imágenes',
      directory: uploadsDir,
      images: imageFiles,
      count: imageFiles.length,
    };
  }

  /**
   * Obtiene la ruta completa del archivo de imagen
   */
  private getImageFilePath(filename: string): string {
    const studentsDir = this.getStudentsDirectory();
    return path.join(studentsDir, filename);
  }

  /**
   * Obtiene el directorio de imágenes de estudiantes
   */
  private getStudentsDirectory(): string {
    return process.env.NODE_ENV === 'production' 
      ? '/tmp/uploads/students'
      : path.join(process.cwd(), 'uploads', 'students');
  }

  /**
   * Verifica si un archivo existe
   */
  private fileExists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  /**
   * Determina el content-type basado en la extensión del archivo
   */
  private getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Establece headers apropiados para servir imágenes
   */
  private setImageHeaders(response: Response, contentType: string, contentLength: number): void {
    response.set({
      'Content-Type': contentType,
      'Content-Length': contentLength.toString(),
      'Cache-Control': 'public, max-age=31536000',
      'Access-Control-Allow-Origin': '*',
    });
  }

  /**
   * Verifica si un archivo es una imagen por su extensión
   */
  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }

  /**
   * Lista todas las imágenes en el directorio de estudiantes
   */
  async listImages() {
    try {
      const uploadsDir = this.getStudentsDirectory();
      this.logger.log(`📁 Listando imágenes desde: ${uploadsDir}`);
      
      const files = fs.readdirSync(uploadsDir);
      const imageFiles = files.filter(file => this.isImageFile(file));
      
      this.logger.log(`🖼️ Imágenes encontradas: ${imageFiles.length}`);
      
      return {
        message: 'Lista de imágenes',
        directory: uploadsDir,
        images: imageFiles,
        count: imageFiles.length,
      };
    } catch (error) {
      this.logger.error(`❌ Error listando imágenes: ${error.message}`);
      return {
        message: 'Error listando imágenes',
        error: error.message,
      };
    }
  }

  /**
   * Prueba el acceso a una imagen específica
   */
  async testImageAccess(filename: string) {
    try {
      const filePath = this.getImageFilePath(filename);
      this.logger.log(`🔍 Verificando archivo: ${filePath}`);
      
      const exists = fs.existsSync(filePath);
      const stats = exists ? fs.statSync(filePath) : null;
      
      return {
        message: 'Test de acceso a imagen',
        filename,
        filePath,
        exists,
        size: stats ? stats.size : null,
        staticUrl: `/uploads/students/${filename}`,
      };
    } catch (error) {
      this.logger.error(`❌ Error test imagen: ${error.message}`);
      return {
        message: 'Error en test de imagen',
        error: error.message,
      };
    }
  }
}