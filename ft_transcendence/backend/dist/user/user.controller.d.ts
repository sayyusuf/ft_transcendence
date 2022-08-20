/// <reference types="multer" />
import { ChangeNickDto } from './dto/changenick.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    authUser(code: string): Promise<any>;
    getUserByNick(nickname: any): Promise<import(".prisma/client").User>;
    getUserById(id: any): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User>;
    updateNickanme(changeNickDto: ChangeNickDto): Promise<{
        nick: string;
    }>;
    updateAvatar(file: Express.Multer.File, id: number): Promise<import(".prisma/client").User>;
}
