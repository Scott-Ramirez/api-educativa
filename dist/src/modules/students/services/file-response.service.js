"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FileResponseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileResponseService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let FileResponseService = FileResponseService_1 = class FileResponseService {
    logger = new common_1.Logger(FileResponseService_1.name);
    async serveImageFile(filename, response) {
        const filePath = this.getImageFilePath(filename);
        if (!this.fileExists(filePath)) {
            throw new common_1.NotFoundException('Imagen no encontrada');
        }
        const stats = fs.statSync(filePath);
        const contentType = this.getContentType(filename);
        this.setImageHeaders(response, contentType, stats.size);
        this.logger.log(`📤 Sirviendo imagen: ${filename}`);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(response);
    }
    getFileTestInfo(filename) {
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
    getImageFilePath(filename) {
        const studentsDir = this.getStudentsDirectory();
        return path.join(studentsDir, filename);
    }
    getStudentsDirectory() {
        return process.env.NODE_ENV === 'production'
            ? '/tmp/uploads/students'
            : path.join(process.cwd(), 'uploads', 'students');
    }
    fileExists(filePath) {
        try {
            return fs.existsSync(filePath);
        }
        catch {
            return false;
        }
    }
    getContentType(filename) {
        const ext = path.extname(filename).toLowerCase();
        const contentTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
        };
        return contentTypes[ext] || 'application/octet-stream';
    }
    setImageHeaders(response, contentType, contentLength) {
        response.set({
            'Content-Type': contentType,
            'Content-Length': contentLength.toString(),
            'Cache-Control': 'public, max-age=31536000',
            'Access-Control-Allow-Origin': '*',
        });
    }
    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path.extname(filename).toLowerCase();
        return imageExtensions.includes(ext);
    }
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
        }
        catch (error) {
            this.logger.error(`❌ Error listando imágenes: ${error.message}`);
            return {
                message: 'Error listando imágenes',
                error: error.message,
            };
        }
    }
    async testImageAccess(filename) {
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
        }
        catch (error) {
            this.logger.error(`❌ Error test imagen: ${error.message}`);
            return {
                message: 'Error en test de imagen',
                error: error.message,
            };
        }
    }
};
exports.FileResponseService = FileResponseService;
exports.FileResponseService = FileResponseService = FileResponseService_1 = __decorate([
    (0, common_1.Injectable)()
], FileResponseService);
//# sourceMappingURL=file-response.service.js.map