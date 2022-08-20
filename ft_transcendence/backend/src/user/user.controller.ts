import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';
import { ChangeNickDto } from './dto/changenick.dto';
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

	@Post('change-nickname')
	async updateNickanme(@Body() changeNickDto: ChangeNickDto){
		return await this.userService.changeNickName(changeNickDto)
	}

	@Post('change-avatar')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage ({
			destination: './public',
			filename: (req, file, callback) => {
				const ext = extname(file.originalname)
				const filename = `${file.originalname}`
				callback(null, filename)
			}
		})
	}))
	async updateAvatar(@UploadedFile() file: Express.Multer.File, @Body('id') id: number){
		console.log('file ', file)
		console.log('id ', id)

		return await this.userService.changeAvatar(id)
	}

}
