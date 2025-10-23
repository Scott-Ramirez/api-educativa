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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/roles.decorator");
const students_service_1 = require("./students.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
const file_upload_service_1 = require("./services/file-upload.service");
const file_response_service_1 = require("./services/file-response.service");
let StudentsController = class StudentsController {
    studentsService;
    fileUploadService;
    fileResponseService;
    constructor(studentsService, fileUploadService, fileResponseService) {
        this.studentsService = studentsService;
        this.fileUploadService = fileUploadService;
        this.fileResponseService = fileResponseService;
    }
    create(dto) {
        return this.studentsService.create(dto);
    }
    findAll() {
        return this.studentsService.findAll();
    }
    getMyChildren(req) {
        const parentId = req.user.id;
        return this.studentsService.getStudentsByParent(parentId);
    }
    findOne(id) {
        return this.studentsService.findOne(+id);
    }
    getStudentRelations(id) {
        return this.studentsService.getStudentRelations(+id);
    }
    update(id, dto) {
        return this.studentsService.update(+id, dto);
    }
    remove(id) {
        return this.studentsService.remove(+id);
    }
    async uploadStudentImage(id, file) {
        return this.fileUploadService.uploadStudentImage(+id, file, this.studentsService);
    }
    async deleteStudentImage(id) {
        const result = await this.studentsService.deleteStudentImage(+id);
        return {
            message: result ? 'Imagen eliminada exitosamente' : 'No se pudo eliminar la imagen',
            success: result,
        };
    }
    async listImages() {
        return this.fileResponseService.listImages();
    }
    async testImageAccess(filename) {
        return this.fileResponseService.testImageAccess(filename);
    }
    async serveImage(filename, res) {
        return this.fileResponseService.serveImageFile(filename, res);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-children'),
    (0, roles_decorator_1.Roles)('PARENT'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getMyChildren", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/relations'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getStudentRelations", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/upload-image'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: require('multer').memoryStorage(),
        fileFilter: (req, file, cb) => {
            const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const fileExtension = require('path').extname(file.originalname).toLowerCase();
            const isMimeValid = validMimeTypes.includes(file.mimetype.toLowerCase());
            const isExtensionValid = validExtensions.includes(fileExtension);
            if (isMimeValid || isExtensionValid) {
                cb(null, true);
            }
            else {
                cb(new Error(`Solo se permiten archivos de imagen. MIME recibido: ${file.mimetype}, Extensión: ${fileExtension}`), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "uploadStudentImage", null);
__decorate([
    (0, common_1.Delete)(':id/image'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "deleteStudentImage", null);
__decorate([
    (0, common_1.Get)('images/list'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "listImages", null);
__decorate([
    (0, common_1.Get)('images/test/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "testImageAccess", null);
__decorate([
    (0, common_1.Get)('images/serve/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "serveImage", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService,
        file_upload_service_1.FileUploadService,
        file_response_service_1.FileResponseService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map