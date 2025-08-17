
import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { EmployeeTaskStatus } from './employee-task.entity';

export class CreateEmployeeTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsNumber()
  employeeId: number;
}

export class UpdateEmployeeTaskDto {
  @IsOptional()
  @IsString()
  submissionUrl?: string;

  @IsOptional()
  @IsEnum(EmployeeTaskStatus)
  status?: EmployeeTaskStatus;
}

export class SubmitEmployeeTaskDto {
  @IsNotEmpty()
  @IsString()
  submissionUrl: string;
}
export class SubmitTaskDto {
  @IsNotEmpty()
  @IsString()
  submissionUrl: string;
}