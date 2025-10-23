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
exports.SimpleStudentsAppModule = void 0;
const common_1 = require("@nestjs/common");
const basic_health_controller_1 = require("./basic-health.controller");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
let SimpleStudentsController = class SimpleStudentsController {
    findAll() {
        return {
            message: 'Students endpoint funcionando',
            data: [],
            count: 0,
            withoutDatabase: true
        };
    }
    findOne(id) {
        return {
            message: `Student ${id} endpoint funcionando`,
            data: { id, name: 'Test Student' },
            withoutDatabase: true
        };
    }
    async uploadPhoto(id, file) {
        return {
            message: 'Upload endpoint funcionando',
            studentId: id,
            filename: file?.originalname || 'no-file',
            size: file?.size || 0,
            withoutDatabase: true
        };
    }
};
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SimpleStudentsController.prototype, "findAll", null);
__decorate([
    (0, common_2.Get)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SimpleStudentsController.prototype, "findOne", null);
__decorate([
    (0, common_2.Post)('upload-photo/:id'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SimpleStudentsController.prototype, "uploadPhoto", null);
SimpleStudentsController = __decorate([
    (0, common_2.Controller)('students')
], SimpleStudentsController);
let SimpleStudentsAppModule = class SimpleStudentsAppModule {
};
exports.SimpleStudentsAppModule = SimpleStudentsAppModule;
exports.SimpleStudentsAppModule = SimpleStudentsAppModule = __decorate([
    (0, common_1.Module)({
        controllers: [basic_health_controller_1.BasicHealthController, SimpleStudentsController],
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
], SimpleStudentsAppModule);
//# sourceMappingURL=simple-students-app.module.js.map