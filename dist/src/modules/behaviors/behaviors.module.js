"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const behaviors_service_1 = require("./behaviors.service");
const behaviors_controller_1 = require("./behaviors.controller");
const behavior_entity_1 = require("./entities/behavior.entity");
const student_entity_1 = require("../students/entities/student.entity");
let BehaviorsModule = class BehaviorsModule {
};
exports.BehaviorsModule = BehaviorsModule;
exports.BehaviorsModule = BehaviorsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([behavior_entity_1.Behavior, student_entity_1.Student])],
        controllers: [behaviors_controller_1.BehaviorsController],
        providers: [behaviors_service_1.BehaviorsService],
    })
], BehaviorsModule);
//# sourceMappingURL=behaviors.module.js.map