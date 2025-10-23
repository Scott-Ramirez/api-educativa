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
exports.InvitesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invite_entity_1 = require("./entities/invite.entity");
const crypto = require("crypto");
let InvitesService = class InvitesService {
    inviteRepo;
    constructor(inviteRepo) {
        this.inviteRepo = inviteRepo;
    }
    async create(student, createdBy, expiresHours) {
        const token = crypto.randomBytes(24).toString('hex');
        const hash = crypto.createHash('sha256').update(token).digest('hex');
        const invite = this.inviteRepo.create({
            codeHash: hash,
            student,
            createdBy,
            expiresAt: expiresHours ? new Date(Date.now() + expiresHours * 3600 * 1000) : undefined,
        });
        await this.inviteRepo.save(invite);
        return { token, inviteId: invite.id };
    }
    async findByToken(token) {
        const hash = crypto.createHash('sha256').update(token).digest('hex');
        const invite = await this.inviteRepo.findOne({ where: { codeHash: hash }, relations: ['student'] });
        return invite;
    }
    async markUsed(invite, userId) {
        invite.used = true;
        invite.usedBy = userId;
        await this.inviteRepo.save(invite);
    }
};
exports.InvitesService = InvitesService;
exports.InvitesService = InvitesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invite_entity_1.Invite)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvitesService);
//# sourceMappingURL=invites.service.js.map