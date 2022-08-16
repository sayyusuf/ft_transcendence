import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
	constructor(private context:PrismaService){}
	
	addUser(userDto:UserDto){
		try
		{
			const createdUser = this.context.user.create({
				data:{
					email:userDto.email,
					name:userDto.name,
					surname:userDto.surname
				}
			})
			return createdUser;
		}	
		catch
		{
			return new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

	getAll(){
		return this.context.user.findMany({
			include:{
				posts:true
			}
		})
	}
}
