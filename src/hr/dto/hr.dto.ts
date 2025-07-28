import { IsEmail, IsInt, isNotEmpty, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, IsStrongPassword, Length, Matches } from "class-validator";



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

    @IsNotEmpty()
    @IsNumberString()
    @Length(11, 15)
    @IsPhoneNumber('BD', { message: 'Phone number must be a valid Bangladeshi number' })
    phone: string;

}