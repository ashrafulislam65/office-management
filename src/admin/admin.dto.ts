import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsPositive, IsString, Length, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
//   @IsEmail()
//     @Matches(/\.xyz$/, { message: 'Email must have .xyz domain' })
//     email: string;

//     @IsNotEmpty()
//     @Length(3, 8)
//     password: string;

//     @IsNotEmpty()
//     @Matches(/^[a-zA-Z ]+$/, { message: 'Name should contain only alphabets' })
//     name: string;

//     @IsNotEmpty()
//     @Matches(/^\d{10}$/, { message: 'invalid nid' })
//     nidNumber: string;
// }

// export class loginDTO {
//     @IsEmail() email: string;
//     @IsNotEmpty() password: string;



    @IsOptional()
    @IsString()
    @Length(1, 100)
    
    fullName?: string;


    
    @IsNotEmpty({ message: 'Phone number is required' })
   // @Matches(/^[0-9]+$/, { message: 'Phone number must be a positive integer cannot start with 0' })
    phone:bigint;


    @IsOptional()
    @IsBoolean()
    isActive?: boolean ;

   
    @IsEmail()
    //@Matches(/\.xyz$/, { message: 'Email must have .com' })
    Email: string;


    @IsNotEmpty()
    @Length(6,20)
    password: string;
     
}