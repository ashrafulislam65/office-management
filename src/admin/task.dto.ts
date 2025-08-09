// src/admin/task.dto.ts
import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from './task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  hrId: number; // HR entity has numeric ID

  @IsOptional()
  @IsString()
  submissionUrl?: string; 


}

export class UpdateTaskDto {
//   @IsOptional()
//   @IsString()
//   title?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsDateString()
//   dueDate?: string;

//   @IsOptional()
//   @IsEnum(TaskStatus)
//   status?: TaskStatus;

  @IsOptional()
  @IsString()
  submissionUrl?: string;
}