import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    authUser(code: string): Promise<import(".prisma/client").User>;
    getUserByNick(nickname: any): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User>;
    getUserById(id: any): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User>;
}
