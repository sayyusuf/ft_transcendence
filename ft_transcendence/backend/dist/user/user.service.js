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
exports.UserService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(context, config, httpService) {
        this.context = context;
        this.config = config;
        this.httpService = httpService;
    }
    async getToken(code) {
        try {
            const data = {
                grant_type: 'authorization_code',
                client_id: this.config.get('CLIENT_ID'),
                client_secret: this.config.get('CLIENT_SECRET'),
                code: code,
                redirect_uri: this.config.get('REDIRECT_URI')
            };
            const res = await (0, rxjs_1.firstValueFrom)(this.httpService.post('https://api.intra.42.fr/oauth/token', data));
            return res.data;
        }
        catch (_a) {
            throw new common_1.HttpException('Error occured', common_1.HttpStatus.FORBIDDEN);
        }
    }
    async getUser(accessObject) {
        try {
            const data = await (0, rxjs_1.lastValueFrom)(this.httpService.get('https://api.intra.42.fr/v2/me', {
                headers: {
                    'Authorization': `Bearer ${accessObject.access_token}`
                }
            }).pipe((0, rxjs_1.map)(resp => resp.data)));
            return data;
        }
        catch (_a) {
            throw new common_1.HttpException('Error occured', common_1.HttpStatus.FORBIDDEN);
        }
    }
    getUserById(id) {
        try {
            const userExist = this.context.user.findUnique({
                where: {
                    id: id
                }
            });
            if (userExist)
                return userExist;
            return null;
        }
        catch (_a) {
            throw new common_1.HttpException('Error occured', common_1.HttpStatus.FORBIDDEN);
        }
    }
    getUserByNick(nick) {
        try {
            const userExist = this.context.user.findUnique({
                where: {
                    nick: nick
                }
            });
            if (userExist)
                return userExist;
            return null;
        }
        catch (_a) {
            throw new common_1.HttpException('Error occured', common_1.HttpStatus.FORBIDDEN);
        }
    }
    addNewUser(userData) {
        try {
            const user = this.context.user.create({
                data: {
                    nick: userData.login,
                    avatar: '',
                    email: userData.email,
                    name: userData.first_name,
                    surname: userData.last_name,
                    status: 0,
                    win: 0,
                    lose: 0,
                    level: 0
                }
            });
            return user;
        }
        catch (_a) {
            throw new common_1.HttpException('Error occured', common_1.HttpStatus.FORBIDDEN);
        }
    }
    async authUser(code) {
        try {
            const accessObject = await this.getToken(code);
            const userData = await this.getUser(accessObject);
            const userExist = await this.getUserByNick(userData.login);
            if (!userExist)
                return this.addNewUser(userData);
            return userExist;
        }
        catch (_a) {
            throw new common_1.HttpException('Error occured', common_1.HttpStatus.FORBIDDEN);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, config_1.ConfigService, axios_1.HttpService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map