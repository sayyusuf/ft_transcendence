import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private context;
    private config;
    private readonly httpService;
    constructor(context: PrismaService, config: ConfigService, httpService: HttpService);
    getToken(code: string): Promise<any>;
    getUser(accessObject: any): Promise<any>;
    getUserById(id: any): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User>;
    getUserByNick(nick: string): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User>;
    addNewUser(userData: any): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User>;
    authUser(code: string): Promise<import(".prisma/client").User>;
}
