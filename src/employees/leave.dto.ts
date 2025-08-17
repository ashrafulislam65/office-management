import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LeaveStatus, LeaveType } from './leave.entity';

export class CreateLeaveDto {
    @IsInt()
    @IsNotEmpty()
    employeeId: number;

    @IsEnum(LeaveType)
    type: LeaveType;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;

    @IsString()
    @IsOptional()
    reason?: string;
}

export class UpdateLeaveStatusDto {
    @IsEnum(LeaveStatus)
    @IsNotEmpty()
    status: LeaveStatus;
}

export class UpdateLeaveDto {
    @IsEnum(LeaveType)
    @IsOptional()
    type?: LeaveType;

    @IsDateString()
    @IsOptional()
    startDate?: Date;

    @IsDateString()
    @IsOptional()
    endDate?: Date;

    @IsString()
    @IsOptional()
    reason?: string;
}