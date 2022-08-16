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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AuthService = class AuthService {
    constructor(prisma, jwt, config, httpService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.httpService = httpService;
    }
    async signup(dto) {
        try {
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash
                }
            });
            return {
                statusCode: 200,
                message: 'User successfully created'
            };
        }
        catch (_a) {
            return {
                statusCode: 403,
                message: 'Error occured'
            };
        }
    }
    async signin(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (!user) {
            throw new common_1.ForbiddenException('Credentials incorrect');
        }
        const pwMatches = await argon.verify(user.hash, dto.password);
        if (!pwMatches) {
            throw new common_1.ForbiddenException('Credentials incorrect');
        }
        return this.signToken(user.id, user.email);
    }
    async signToken(userId, email) {
        const payload = {
            sub: userId,
            email: email
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        });
        return {
            access_token: token
        };
    }
    getIntraToken(code) {
        const data = {
            grant_type: 'authorization_code',
            client_id: this.config.get('CLIENT_ID'),
            client_secret: this.config.get('CLIENT_SECRET'),
            code: code,
            redirect_uri: this.config.get('REDIRECT_URI')
        };
        const res = this.httpService.post('https://api.intra.42.fr/oauth/token', data).pipe((0, rxjs_1.map)(response => response.data));
        return res;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, config_1.ConfigService, axios_1.HttpService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map