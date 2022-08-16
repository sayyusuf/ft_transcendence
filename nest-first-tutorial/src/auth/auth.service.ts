import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client"
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from 'axios'
import { map, Observable } from "rxjs";

@Injectable()
export class AuthService{
	constructor(private prisma:PrismaService, private jwt:JwtService, private config:ConfigService, private readonly httpService: HttpService){
		
	}
	async signup(dto: AuthDto){
		try{
			const hash = await argon.hash(dto.password);
			const user = await this.prisma.user.create({
				data:{
					email: dto.email,
					hash: hash
				}
			})
			return {
				statusCode: 200,
				message: 'User successfully created'
			}
		}
		catch{
			return {
				statusCode: 403,
				message: 'Error occured'
			}
		}
		
	}

	async signin(dto:AuthDto){
		// find the user bu email
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user){
			throw new ForbiddenException('Credentials incorrect')
		}

		const pwMatches = await argon.verify(user.hash, dto.password)
		if (!pwMatches){
			throw new ForbiddenException('Credentials incorrect')
		}

		return this.signToken(user.id, user.email)
	}

	async signToken(userId: number, email: string): Promise<{ access_token:string }> {
		const payload = {
			sub: userId,
			email: email
		}
		const secret = this.config.get('JWT_SECRET')

		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m', // 15 dakika
			secret: secret
		})

		return {
			access_token: token
		}
	}
	
	getIntraToken(code:string)
	{
		const data = {
			grant_type: 'authorization_code',
			client_id: this.config.get('CLIENT_ID'),
			client_secret: this.config.get('CLIENT_SECRET'),
			code:code,
			redirect_uri: this.config.get('REDIRECT_URI')
		}
		const res:Observable<AxiosResponse<any,any>> = this.httpService.post('https://api.intra.42.fr/oauth/token', data).pipe(
			map(response=> response.data)
		)
		return res;
	}
}