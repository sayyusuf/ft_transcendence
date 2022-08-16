import { HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
export declare class UserService {
    private context;
    constructor(context: PrismaService);
    addUser(userDto: UserDto): import(".prisma/client").Prisma.Prisma__UserClient<import(".prisma/client").User> | HttpException;
    getAll(): import(".prisma/client").PrismaPromise<(import(".prisma/client").User & {
        posts: import(".prisma/client").Post[];
    })[]>;
}
