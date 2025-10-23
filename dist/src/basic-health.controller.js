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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicHealthController = void 0;
const common_1 = require("@nestjs/common");
let BasicHealthController = class BasicHealthController {
    getHealth() {
        return {
            status: 'OK',
            message: 'API Educativa - Health Check',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            hasController: true
        };
    }
    getDetailedHealth() {
        return {
            status: 'OK',
            message: 'API Educativa - Detailed Health Check',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'production',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            hasController: true,
            hasRoutes: true
        };
    }
};
exports.BasicHealthController = BasicHealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BasicHealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('detail'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BasicHealthController.prototype, "getDetailedHealth", null);
exports.BasicHealthController = BasicHealthController = __decorate([
    (0, common_1.Controller)('health')
], BasicHealthController);
//# sourceMappingURL=basic-health.controller.js.map