import { IsEmail, IsInt, isNotEmpty, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";



export class CreateHrDto{

    @IsNotEmpty()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}