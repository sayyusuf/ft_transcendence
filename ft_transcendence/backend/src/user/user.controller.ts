import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService:UserService){ }

	@Get('auth')
	async authUser(@Query('code') code:string){
		return await this.userService.authUser(code)
	}

	@Get('nick/:nick')
	getUserByNick(@Param('nick') nickname){
		return this.userService.getUserByNick(nickname)
	}

	@Get('id/:id')
	getUserById(@Param('id') id){
		return this.userService.getUserById(parseInt(id))
	}


}
