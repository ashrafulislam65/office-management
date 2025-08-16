import { IsDateString, IsNotEmpty, IsNumber, isNumber, IsOptional, IsString } from "class-validator";

export class CreateSalaryDto {


  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  payDate: Date;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  empFullName;

  @IsNotEmpty()
  paidByFullName;

  @IsNumber()
  bonus?: number;

  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsNotEmpty()
  @IsNumber()
  paidById: number;
}

export class UpdateSalaryDto {

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  payDate?: Date;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsNumber()
  bonus?: number;
}
