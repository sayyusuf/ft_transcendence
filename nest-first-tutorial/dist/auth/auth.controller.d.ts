import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
export declare class AuthController {
    authService: AuthService;
    constructor(authService: AuthService);
    index(): string;
    signup(dto: AuthDto): Promise<{
        statusCode: number;
        message: string;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    intralogin(code: string): import("rxjs").Observable<import("axios").AxiosResponse<any, any>>;
}
