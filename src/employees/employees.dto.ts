import { IsEmail, IsNotEmpty, Matches, IsIn, IsNumberString, Length, IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateEmployeesDto {
    @IsString()
    @MaxLength(100)
    fullName: string;

    @IsInt()
    @Min(0)
    age: number;

    @IsEmail()
    @Matches(/.*aiub\.edu$/, {
        message: 'Email must be from aiub.edu domain'
    })
    email: string;

    @IsNotEmpty()
    @Length(6, 30)
    @Matches(/(?=.*[A-Z])/, {
        message: 'Password must contain at least one uppercase letter'
    })
    password: string;

    @IsIn(['male', 'female'], {
        message: 'Gender must be either male or female'
    })
    gender: string;

    @IsNumberString()
    @Length(11, 15)
    phoneNumber: string;
}

export class UpdateEmployeesStatusDto {
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}