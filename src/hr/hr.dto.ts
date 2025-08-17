// src/admin/hr.dto.ts
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateHrDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
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

  // Include all other fields as optional
  // ...
}