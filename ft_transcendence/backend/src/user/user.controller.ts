import { BadRequestException, Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, Param, ParseFilePipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
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
		}),
		fileFilter: (req: any, file: { mimetype: string }, cb: (error: Error | null, acceptFile: boolean) => void) => {
			if (['image/jpg'].includes(file.mimetype)) {
			  cb(null, true);
			} else {
			  cb(new BadRequestException('Only use jpg files'), false);
			}
		  }
	}))
	async updateAvatar(@UploadedFile(
		new ParseFilePipe({
			validators: [
			  new FileTypeValidator({ fileType: 'jpg' }),
			],
		  }),
	) file: Express.Multer.File, @Body('id') id: number){
		return await this.userService.changeAvatar(id)
	}

	@Post('generate')
	async generate2FA(@Body('id') id){
		return await this.userService.generateSecretAndQRCode(Number(id))	
	}

	@Post('verify')
	async verify2fa(@Body('id') id, @Body('token') token ){
		return await this.userService.verify2fa(id, token)
	}

	@Post('change-factor')
	async changeFactor(@Body('id') id){
		return await this.userService.changeFactor(id)
	}

}
