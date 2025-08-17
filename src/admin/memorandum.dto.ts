// memorandum.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemorandumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateMemorandumDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}