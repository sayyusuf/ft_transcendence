import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from 'axios';
import { Observable } from "rxjs";
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private readonly httpService;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, httpService: HttpService);
    signup(dto: AuthDto): Promise<{
        statusCode: number;
        message: string;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signToken(userId: number, email: string): Promise<{
        access_token: string;
    }>;
    getIntraToken(code: string): Observable<AxiosResponse<any, any>>;
}
