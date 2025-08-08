import { IsEmail, IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from "class-validator";

export enum EmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
    
}

export class CreateEmployeesDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100, { message: 'Full name must be shorter than or equal to 100 characters' })
    fullName: string;

    @IsOptional()
    @IsEnum(EmployeeStatus, { 
        message: `Status must be one of: ${Object.values(EmployeeStatus).join(', ')}` 
    })
    status?: EmployeeStatus;

    @IsInt()
    @Min(18, { message: 'Employee must be at least 18 years old' })
    @Max(65, { message: 'Employee must be younger than 65 years' })
    age: number;

    @IsEmail({}, { message: 'Invalid email format' })
    @Matches(/@aiub\.edu$/, {
        message: 'Email must be from aiub.edu domain'
    })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(8, 30, { 
        message: 'Password must be between 8 and 30 characters long' 
    })
    @Matches(/(?=.*[A-Z])/, {
        message: 'Password must contain at least one uppercase letter'
    })
    @Matches(/(?=.*[a-z])/, {
        message: 'Password must contain at least one lowercase letter'
    })
    @Matches(/(?=.*\d)/, {
        message: 'Password must contain at least one number'
    })
    @Matches(/(?=.*[!@#$%^&*])/, {
        message: 'Password must contain at least one special character'
    })
    password: string;

    @IsIn(['male', 'female', 'other'], {
        message: 'Gender must be either male, female or other'
    })
    gender: string;

    @IsNumberString({}, { message: 'Phone number must contain only digits' })
    @Length(11, 15, { 
        message: 'Phone number must be between 11 and 15 digits long' 
    })
    @Matches(/^[0-9]+$/, {
        message: 'Phone number must contain only digits'
    })
    phoneNumber: string;

    @IsOptional()
    @IsNumber({}, { message: 'Salary must be a valid number' })
    @Min(0, { message: 'Salary cannot be negative' })
    salary?: number;

    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Department name too long' })
    department?: string;
}

export class UpdateEmployeesStatusDto {
    @IsNotEmpty()
    @IsEnum(EmployeeStatus, { 
        message: `Status must be one of: ${Object.values(EmployeeStatus).join(', ')}` 
    })
    status: EmployeeStatus;
}