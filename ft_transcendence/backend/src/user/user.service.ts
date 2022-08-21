import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeNickDto } from './dto/changenick.dto';
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";

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

	async getIntraUser(accessObject){
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
			const coalitionData = await lastValueFrom(
				this.httpService.get(`https://api.intra.42.fr/v2/users/${data.id}/coalitions`, {
					headers:{
						'Authorization' : `Bearer ${accessObject.access_token}`
					}
				}).pipe(
				  map(resp => resp.data)
				)
			  );
			  data.coalition_img = coalitionData[0].cover_url
			  data.coalition_color = coalitionData[0].color
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

	async getUserByLogin(login:string){
		try
		{
			const userExist = await this.context.user.findFirst({
				where: {
					login: login
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

	async getUserByNick(nick:string){
		try
		{
			const userExist = await this.context.user.findUnique({
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
					avatar: `${this.config.get('API_URL')}/default.png`,
					email: userData.email,
					name: userData.first_name,
					surname: userData.last_name,
					login: userData.login,
					two_factor_enabled: false,
					status:0,
					win:0,
					lose:0,
					level:0
				}
			})
			const retUser = Object(user)
			return retUser
		}
		catch{
			throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

	async authUser(code:string){
		try
		{
			const accessObject = await this.getToken(code)
			const userData = await this.getIntraUser(accessObject)
			const userExist = await this.getUserByLogin(userData.login)
			let retUser
			if (!userExist){
				retUser = Object(await this.addNewUser(userData))
				retUser.coalition_img = userData.coalition_img
				retUser.coalition_color = userData.coalition_color
				return retUser
			}
			retUser = Object(userExist)
			retUser.coalition_img = userData.coalition_img
			retUser.coalition_color = userData.coalition_color
			return retUser
		}
		catch
		{
			throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
		}
	}

	async changeNickName(changeNickDto: ChangeNickDto){
		const {nick, id} = changeNickDto

		const userExist = await this.getUserByNick(nick)
		if (userExist)
			throw new HttpException('Nickname already taken', HttpStatus.FORBIDDEN)
		const user = this.context.user.findUnique({
			where:{
				id:id
			}
		})
		if (!user)
			throw new HttpException('User not found', HttpStatus.FORBIDDEN)
		await this.context.user.update({
			where:{
				id: id
			},
			data:{
				nick: nick
			}
		})
		return {nick: nick}
	}

	async changeAvatar(id){
		const userExist = await this.getUserById(Number(id))
		if (!userExist)
			throw new HttpException('User not found', HttpStatus.FORBIDDEN)
		const updatedUser = await this.context.user.update({
			where:{
				id: Number(id),
			},
			data:{
				avatar: `${this.config.get('API_URL')}/${userExist.login}.jpg`
			}
		})
		return updatedUser
	}

	async changeFactor(id){
		const userExist = await this.getUserById(Number(id))
		if (!userExist)
			throw new HttpException('User not found', HttpStatus.FORBIDDEN)
		const updatedUser = await this.context.user.update({
			where:{
				id: Number(id),
			},
			data:{
				two_factor_enabled: !userExist.two_factor_enabled
			}
		})
		return updatedUser
	}

	async generateSecretAndQRCode(id){
		const user = await this.getUserById(Number(id))
		if (!user)
			throw new HttpException('User not exist', HttpStatus.FORBIDDEN)
		const secret = speakeasy.generateSecret({
			name: 'ft_transcendence'
		})
		await this.context.user.update({
			where:{
				id: id
			},
			data:{
				two_factor_secret: secret.ascii
			}
		})
		let qrData = null
		const generateQR = async text => {
			try {
				return await qrcode.toDataURL(text);
			} 
			catch (err) {
				throw new HttpException('Error occured', HttpStatus.FORBIDDEN)
			}
		}
		qrData = await generateQR(secret.otpauth_url)
		return qrData
	}

	async verify2fa(id, token){
		const user = await this.getUserById(Number(id))
		if (!user)
			throw new HttpException('User not exist', HttpStatus.FORBIDDEN)
		const verified = speakeasy.totp.verify({
				secret: user.two_factor_secret,
				encoding: 'ascii',
				token: token
			})
		return verified
	}


}
