import { IsString, IsDateString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateHrTaskDto {
    @IsNotEmpty()
    @IsString()
    taskTitle: string;

    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    assignedDate: Date;

    @IsNotEmpty()
    @IsDateString()
    dueDate: Date;

    @IsNotEmpty()
    employeeId: number; 

    @IsNotEmpty()
    hrId: number; 

    @IsEnum(['pending', 'in-progress', 'completed'])
    status?: 'pending' | 'in-progress' | 'completed';
}
