import { HttpException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllUsers(): import(".prisma/client").PrismaPromise<(import(".prisma/client").User & {
        posts: import(".prisma/client").Post[];
    })[]>;
    addNewUser(userDto: UserDto): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User> | HttpException;
}
