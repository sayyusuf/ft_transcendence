import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
	constructor(private context:PrismaService,private config:ConfigService, private readonly httpService: HttpService){}
	
	async getToken(code:string)
	{
		try {
			const data = {
				grant_type: 'authorization_code',
				client_id: this.config.get('CLIENT_ID'),
				client_secret: this.config.get('CLIENT_SECRET'),
				code:code,
				redirect_uri: this.config.get('REDIRECT_URI')
			}
			const res = await firstValueFrom(this.httpService.post('https://api.intra.42.fr/oauth/token', data))
			return res.data;
		}
		
		catch {
			throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

	async getUser(accessObject){
		try {
			const data = await lastValueFrom(
				this.httpService.get('https://api.intra.42.fr/v2/me', {
					headers:{
						'Authorization' : `Bearer ${accessObject.access_token}`
					}
				}).pipe(
				  map(resp => resp.data)
				)
			  );
			  return data
		}
		catch{
			throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

	getUserById(id){
		try
		{
			const userExist = this.context.user.findUnique({
				where: {
					id: id
				}
			})
			if (userExist)
				return userExist
			return null
		}
		catch
		{
			throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

	getUserByNick(nick:string){
		try
		{
			const userExist = this.context.user.findUnique({
				where: {
					nick: nick
				}
			})

			if (userExist)
				return userExist
			return null
		}
		catch
		{
			throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

	addNewUser(userData){
		try{
			const user = this.context.user.create({
				data:{
					nick: userData.login,
					avatar: '',
					email: userData.email,
					name: userData.first_name,
					surname: userData.last_name,
					status:0,
					win:0,
					lose:0,
					level:0
				}
			})
			return user
		}
		catch{
			throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

	async authUser(code:string){
		try
		{
			const accessObject = await this.getToken(code)
			const userData = await this.getUser(accessObject)
			const userExist = await this.getUserByNick(userData.login)
			if (!userExist)
				return this.addNewUser(userData)
			return userExist
		}
		catch
		{
			throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

}
