import { IsEnum, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDateString, IsUUID, IsEmail, ValidateIf } from 'class-validator';
import { DepartmentType } from './department.entity';

export class CreateDepartmentDto {
  @IsEnum(DepartmentType)
  departmentType: DepartmentType;

  @IsNotEmpty()
  role: string;

  @IsNumber()
  employeeId: number;

//   @IsUUID()
//   adminId: string;

@IsNumber()
adminId: number;

  @IsOptional()
  @IsDateString()
  joiningDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
    static email: any;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsEnum(DepartmentType)
  departmentType?: DepartmentType;

  @IsOptional()
  role?: string;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsDateString()
  joiningDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;


  @IsOptional()
  @IsEmail()
  email?: string;

   @ValidateIf(o => !o.employeeId && !o.email)
  @IsNotEmpty({ message: 'Either employeeId or email must be provided' })
  _?: never;

}