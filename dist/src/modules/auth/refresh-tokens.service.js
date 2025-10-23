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
exports.RefreshTokensService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const crypto = require("crypto");
const users_service_1 = require("../users/users.service");
let RefreshTokensService = class RefreshTokensService {
    repo;
    usersService;
    constructor(repo, usersService) {
        this.repo = repo;
        this.usersService = usersService;
    }
    async createForUser(userId, ttlDays = 30) {
        const token = crypto.randomBytes(64).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await this.usersService.findOne(userId);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const expiresAt = new Date(Date.now() + ttlDays * 24 * 3600 * 1000);
        const entity = this.repo.create({ tokenHash, user: user, expiresAt });
        await this.repo.save(entity);
        return { token, id: entity.id, expiresAt };
    }
    async findByToken(token) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        return this.repo.findOne({ where: { tokenHash } });
    }
    async revokeById(id) {
        await this.repo.update({ id }, { revoked: true });
    }
    async revokeToken(token) {
        const r = await this.findByToken(token);
        if (r)
            await this.revokeById(r.id);
    }
};
exports.RefreshTokensService = RefreshTokensService;
exports.RefreshTokensService = RefreshTokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], RefreshTokensService);
//# sourceMappingURL=refresh-tokens.service.js.map