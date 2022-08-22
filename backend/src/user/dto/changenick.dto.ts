import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChangeNickDto{
	@IsNotEmpty()
	@IsString()
	nick:string

	@IsNotEmpty()
	@IsNumber()
	id:number
}