import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeNickDto } from './dto/changenick.dto';
export declare class UserService {
    private context;
    private config;
    private readonly httpService;
    constructor(context: PrismaService, config: ConfigService, httpService: HttpService);
    getToken(code: string): Promise<any>;
    getIntraUser(accessObject: any): Promise<any>;
    getUserById(id: any): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User>;
    getUserByLogin(login: string): Promise<import(".prisma/client").User>;
    getUserByNick(nick: string): Promise<import(".prisma/client").User>;
    addNewUser(userData: any): any;
    authUser(code: string): Promise<any>;
    changeNickName(changeNickDto: ChangeNickDto): Promise<{
        nick: string;
    }>;
    changeAvatar(id: any): Promise<import(".prisma/client").User>;
}
