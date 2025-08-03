import { IsBoolean, IsEmail, IsInt, isNotEmpty, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length, Matches } from "class-validator";



export class CreateHrDto{

    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    username: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 150)
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(11, 15)
    @IsPhoneNumber('BD', { message: 'Phone number must be a valid Bangladeshi number' })
    phone: string; 

    @IsOptional()
    @IsBoolean()
    isWorking?: boolean;

}