import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDto{
	@IsEmail()
	@IsNotEmpty()
	email:string

	@IsNotEmpty()
	@IsString()
	@MinLength(15)
	name:string

	@IsNotEmpty()
	@IsString()
	@MinLength(15)
	surname:string
}