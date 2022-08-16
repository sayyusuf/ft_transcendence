import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService:UserService){ }

	@Get('all')
	getAllUsers(){
		return this.userService.getAll()
	}

	@Post('add')
	addNewUser(@Body() userDto:UserDto){
		return this.userService.addUser(userDto)
	}
}
