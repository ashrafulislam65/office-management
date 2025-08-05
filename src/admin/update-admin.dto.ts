import { IsOptional, IsEmail, Matches, Length, IsString, IsPositive, IsBoolean, IsNotEmpty } from 'class-validator';

 export class UpdateAdminDto {
     
     @IsOptional()
     @IsString()
     @Length(1, 100)
     fullName?: string;
   
     @IsOptional()
     @IsPositive()
     phone?: bigint;
   
     @IsOptional()
     @IsBoolean()
     isActive?: boolean;


     @IsEmail()
     @IsNotEmpty()
    // @Matches(/\.xyz$/, { message: 'Email must have .xyz domain' })
      Email: string;
   }