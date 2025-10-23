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
exports.BehaviorsController = void 0;
const common_1 = require("@nestjs/common");
const behaviors_service_1 = require("./behaviors.service");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const create_behavior_dto_1 = require("./dto/create-behavior.dto");
const update_behavior_dto_1 = require("./dto/update-behavior.dto");
let BehaviorsController = class BehaviorsController {
    behaviorsService;
    constructor(behaviorsService) {
        this.behaviorsService = behaviorsService;
    }
    create(dto) {
        return this.behaviorsService.create(dto);
    }
    findAll() {
        return this.behaviorsService.findAll();
    }
    getBehaviorsByStudent(studentId) {
        return this.behaviorsService.findByStudent(+studentId);
    }
    findOne(id) {
        return this.behaviorsService.findOne(+id);
    }
    update(id, dto) {
        return this.behaviorsService.update(+id, dto);
    }
    remove(id) {
        return this.behaviorsService.remove(+id);
    }
};
exports.BehaviorsController = BehaviorsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_behavior_dto_1.CreateBehaviorDto]),
    __metadata("design:returntype", void 0)
], BehaviorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BehaviorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)('PARENT', 'ADMIN'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BehaviorsController.prototype, "getBehaviorsByStudent", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BehaviorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_behavior_dto_1.UpdateBehaviorDto]),
    __metadata("design:returntype", void 0)
], BehaviorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BehaviorsController.prototype, "remove", null);
exports.BehaviorsController = BehaviorsController = __decorate([
    (0, swagger_1.ApiTags)('behaviors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('behaviors'),
    __metadata("design:paramtypes", [behaviors_service_1.BehaviorsService])
], BehaviorsController);
//# sourceMappingURL=behaviors.controller.js.map