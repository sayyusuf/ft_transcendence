import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";


@Controller('auth') // /auth
export class AuthController{
	authService:AuthService;

	constructor(authService:AuthService){
		this.authService = authService
	}
	@Get('')
	index(){
		return `
			<h1>Hello World</h1>
		`
	}

	/*@Post('signup') //   /auth/signup bu sekilde route yapiyo
	signup(@Body() dto: AuthDto){ // dto => gelen formun Body sini JSON halinde veriyo
		console.log(dto)
		return this.authService.signup()
	}*/

	/* burdaki gibi Body deki namei degiskenede atayabiliyoz
	@Post('signup')
	signup(@Body('email') email: string, @Body('password') password: string ){
		console.log(email, password)
		return this.authService.signup()
	}*/

	
	@Post('signup')
	signup(@Body() dto: AuthDto){
		console.log(dto)
		return this.authService.signup(dto)
	}

	@Post('signin')
	signin(@Body() dto: AuthDto){
		return this.authService.signin(dto)
	}

	@Get('intra-login')
	intralogin(@Query('code') code:string){
		return this.authService.getIntraToken(code);
	}
}
