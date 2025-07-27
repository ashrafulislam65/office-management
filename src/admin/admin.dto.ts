import { IsEmail, IsIn, IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
    @Matches(/\.xyz$/, { message: 'Email must have .xyz domain' })
    email: string;

    @IsNotEmpty()
    @Length(3, 8)
    password: string;

    @IsNotEmpty()
    @Matches(/^[a-zA-Z ]+$/, { message: 'Name should contain only alphabets' })
    name: string;

    @IsNotEmpty()
    @Matches(/^\d{10}$/, { message: 'NID number must be 10 digits' })
    nidNumber: string;
}

export class loginDTO {
    @IsEmail() email: string;
    @IsNotEmpty() password: string;
}