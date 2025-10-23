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
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    configService;
    logger = new common_1.Logger(CloudinaryService_1.name);
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
        this.logger.log('🌤️ Cloudinary configurado correctamente');
    }
    async uploadImage(buffer, filename, studentId) {
        try {
            this.logger.log(`📤 Subiendo imagen para estudiante ${studentId}: ${filename}`);
            return new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload_stream({
                    resource_type: 'image',
                    folder: 'educativa-app/students',
                    public_id: `student_${studentId}_${Date.now()}`,
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ],
                    tags: ['student', `student_${studentId}`],
                }, (error, result) => {
                    if (error) {
                        this.logger.error(`❌ Error subiendo imagen: ${error.message}`);
                        reject(error);
                    }
                    else if (result) {
                        this.logger.log(`✅ Imagen subida exitosamente: ${result.secure_url}`);
                        resolve({
                            public_id: result.public_id,
                            secure_url: result.secure_url,
                            width: result.width,
                            height: result.height,
                            format: result.format,
                            bytes: result.bytes,
                        });
                    }
                    else {
                        reject(new Error('No se recibió resultado de Cloudinary'));
                    }
                }).end(buffer);
            });
        }
        catch (error) {
            this.logger.error(`❌ Error en uploadImage: ${error.message}`);
            throw error;
        }
    }
    async deleteImage(publicId) {
        try {
            this.logger.log(`🗑️ Eliminando imagen: ${publicId}`);
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            if (result.result === 'ok') {
                this.logger.log(`✅ Imagen eliminada exitosamente: ${publicId}`);
                return true;
            }
            else {
                this.logger.warn(`⚠️ No se pudo eliminar la imagen: ${publicId}`);
                return false;
            }
        }
        catch (error) {
            this.logger.error(`❌ Error eliminando imagen: ${error.message}`);
            return false;
        }
    }
    async getImageInfo(publicId) {
        try {
            this.logger.log(`🔍 Obteniendo info de imagen: ${publicId}`);
            const result = await cloudinary_1.v2.api.resource(publicId);
            return {
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
                created_at: result.created_at,
            };
        }
        catch (error) {
            this.logger.error(`❌ Error obteniendo info de imagen: ${error.message}`);
            throw error;
        }
    }
    async listStudentImages() {
        try {
            this.logger.log('📋 Listando imágenes de estudiantes');
            const result = await cloudinary_1.v2.search
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
        }
        catch (error) {
            this.logger.error(`❌ Error listando imágenes: ${error.message}`);
            throw error;
        }
    }
    generateTransformedUrl(publicId, options = {}) {
        try {
            const transformations = [];
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
            return cloudinary_1.v2.url(publicId, {
                transformation: transformations,
                secure: true
            });
        }
        catch (error) {
            this.logger.error(`❌ Error generando URL transformada: ${error.message}`);
            throw error;
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map