import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    UserModule,
    PrismaModule, 
    ConfigModule.forRoot({
    isGlobal:true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    })
  ],


})
export class AppModule {}
