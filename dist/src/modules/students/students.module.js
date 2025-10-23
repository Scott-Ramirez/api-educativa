"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const students_controller_1 = require("./students.controller");
const students_service_1 = require("./students.service");
const student_entity_1 = require("./entities/student.entity");
const file_upload_service_1 = require("./services/file-upload.service");
const file_response_service_1 = require("./services/file-response.service");
const cloudinary_service_1 = require("./services/cloudinary.service");
let StudentsModule = class StudentsModule {
};
exports.StudentsModule = StudentsModule;
exports.StudentsModule = StudentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([student_entity_1.Student]),
            config_1.ConfigModule
        ],
        controllers: [students_controller_1.StudentsController],
        providers: [students_service_1.StudentsService, file_upload_service_1.FileUploadService, file_response_service_1.FileResponseService, cloudinary_service_1.CloudinaryService],
        exports: [students_service_1.StudentsService],
    })
], StudentsModule);
//# sourceMappingURL=students.module.js.map