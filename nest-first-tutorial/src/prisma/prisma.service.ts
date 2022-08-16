import { Injectable } from '@nestjs/common';
import {ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(private config: ConfigService){
		// super => base classin constructorini cagiriyo yoksa cagirmiyo default olarak
		super({
			datasources:{
				db:{
					//url: 'postgresql://postgres:123@localhost:5437/nest?schema=public',
					url: config.get('DATABASE_URL'), // .env dosyasina gidiyo
				}
			}
		})
	}
}
