"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const cloudinary_service_1 = require("./cloudinary.service");
let FileUploadService = FileUploadService_1 = class FileUploadService {
    cloudinaryService;
    logger = new common_1.Logger(FileUploadService_1.name);
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    getImageUploadOptions() {
        return {
            storage: (0, multer_1.diskStorage)({
                destination: this.getUploadDestination.bind(this),
                filename: this.generateUniqueFilename.bind(this),
            }),
            fileFilter: this.validateImageFile.bind(this),
            limits: {
                fileSize: this.getMaxFileSize(),
            },
        };
    }
    getUploadDestination(req, file, callback) {
        const uploadDir = this.isProduction()
            ? '/tmp/uploads/students'
            : './uploads/students';
        this.ensureDirectoryExists(uploadDir);
        callback(null, uploadDir);
    }
    generateUniqueFilename(req, file, callback) {
        const timestamp = Date.now();
        const extension = (0, path_1.extname)(file.originalname);
        const studentId = req.params.id;
        const uniqueName = `student_${studentId}_${timestamp}${extension}`;
        this.logger.log(`📄 Generando nombre de archivo: ${uniqueName}`);
        callback(null, uniqueName);
    }
    validateImageFile(req, file, callback) {
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
        const fileExtension = (0, path_1.extname)(file.originalname).toLowerCase();
        const isMimeValid = validMimeTypes.includes(file.mimetype.toLowerCase());
        const isExtensionValid = validExtensions.includes(fileExtension);
        this.logger.log(`✅ MIME válido: ${isMimeValid}`);
        this.logger.log(`✅ Extensión válida: ${isExtensionValid}`);
        if (isMimeValid || isExtensionValid) {
            this.logger.log('✅ Archivo aceptado');
            callback(null, true);
        }
        else {
            this.logger.error('❌ Archivo rechazado - Tipo no permitido');
            const error = new Error(`Solo se permiten archivos de imagen. MIME recibido: ${file.mimetype}, Extensión: ${fileExtension}`);
            callback(error, false);
        }
    }
    fileExists(filePath) {
        try {
            return fs.existsSync(filePath);
        }
        catch (error) {
            this.logger.error(`❌ Error verificando archivo: ${error.message}`);
            return false;
        }
    }
    async uploadStudentImage(studentId, file, studentsService) {
        this.logger.log(`📤 Iniciando upload de imagen para estudiante: ${studentId}`);
        this.logger.log(`📄 Archivo recibido: ${file ? 'SÍ' : 'NO'}`);
        if (!file) {
            this.logger.error('❌ No se proporcionó archivo');
            throw new Error('No se proporcionó archivo de imagen');
        }
        try {
            const cloudinaryResult = await this.cloudinaryService.uploadImage(file.buffer, file.originalname, studentId);
            this.logger.log(`✅ Imagen subida a Cloudinary: ${cloudinaryResult.secure_url}`);
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
        }
        catch (error) {
            this.logger.error(`❌ Error subiendo imagen: ${error.message}`);
            throw new Error(`Error subiendo imagen: ${error.message}`);
        }
    }
    async deleteStudentImage(studentId, publicId, studentsService) {
        try {
            this.logger.log(`🗑️ Eliminando imagen del estudiante ${studentId}: ${publicId}`);
            const deleted = await this.cloudinaryService.deleteImage(publicId);
            if (deleted) {
                await studentsService.updateImageUrl(studentId, null);
                this.logger.log(`✅ Imagen eliminada y BD actualizada`);
                return true;
            }
            else {
                this.logger.warn(`⚠️ No se pudo eliminar la imagen de Cloudinary`);
                return false;
            }
        }
        catch (error) {
            this.logger.error(`❌ Error eliminando imagen: ${error.message}`);
            return false;
        }
    }
    deleteFile(filePath) {
        try {
            if (this.fileExists(filePath)) {
                fs.unlinkSync(filePath);
                this.logger.log(`🗑️ Archivo eliminado: ${filePath}`);
                return true;
            }
            return false;
        }
        catch (error) {
            this.logger.error(`❌ Error eliminando archivo: ${error.message}`);
            return false;
        }
    }
    listFiles(directory) {
        try {
            if (!fs.existsSync(directory)) {
                return [];
            }
            const files = fs.readdirSync(directory);
            return files.filter(file => this.isImageFile(file));
        }
        catch (error) {
            this.logger.error(`❌ Error listando archivos: ${error.message}`);
            return [];
        }
    }
    isProduction() {
        return process.env.NODE_ENV === 'production';
    }
    getMaxFileSize() {
        return 5 * 1024 * 1024;
    }
    ensureDirectoryExists(directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
            this.logger.log(`📁 Directorio creado: ${directory}`);
        }
    }
    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = (0, path_1.extname)(filename).toLowerCase();
        return imageExtensions.includes(ext);
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = FileUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map