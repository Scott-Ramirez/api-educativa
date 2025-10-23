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
exports.InvitesController = void 0;
const common_1 = require("@nestjs/common");
const invites_service_1 = require("./invites.service");
const students_service_1 = require("../students/students.service");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/roles.decorator");
let InvitesController = class InvitesController {
    invites;
    students;
    constructor(invites, students) {
        this.invites = invites;
        this.students = students;
    }
    async create(body, req) {
        const student = await this.students.findOne(body.studentId);
        if (!student)
            throw new Error('Student not found');
        const res = await this.invites.create(student, req.user?.id, body.expiresHours ?? 72);
        return { message: 'Invite creado', token: res.token, inviteId: res.inviteId };
    }
};
exports.InvitesController = InvitesController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "create", null);
exports.InvitesController = InvitesController = __decorate([
    (0, common_1.Controller)('admin/invites'),
    __metadata("design:paramtypes", [invites_service_1.InvitesService, students_service_1.StudentsService])
], InvitesController);
//# sourceMappingURL=invites.controller.js.map