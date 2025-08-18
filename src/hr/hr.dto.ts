// src/admin/hr.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEmail,
  Matches,
} from 'class-validator';

export class CreateHrDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email' })
  @Matches(/^[\w.-]+@office\.com$/, {
    message: 'Email must end with @office.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:\+88)?01[3-9]\d{8}$/, {
    message: 'Phone must be a valid Bangladeshi number',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  salary: string;

  @IsOptional()
  @IsBoolean()
  isWorking?: boolean;

  @IsOptional()
  @IsString()
  age?: string;

  @IsOptional()
  @IsString()
  gender?: string;
}

export class UpdateHrDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  @Matches(/^[\w.-]+@office\.com$/, {
    message: 'Email must end with @office.com',
  })
  email?: string;

  @IsOptional()
  @Matches(/^(?:\+88)?01[3-9]\d{8}$/, {
    message: 'Phone must be a valid Bangladeshi number',
  })
  phone?: string;
}
