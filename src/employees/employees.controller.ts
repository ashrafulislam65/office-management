import { Body, Controller, Get, Post, Put, Param, UsePipes, ValidationPipe, ParseIntPipe, HttpException, HttpStatus, NotFoundException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { ChangePasswordDto, CreateEmployeesDto, UpdateEmployeeProfileDto, UpdateEmployeesStatusDto } from './employees.dto';
import { Employees } from './employees.entity';
import { CreateAttendanceDto } from 'src/hr/dto/hr.attendanceDto';
import { AttendanceEntity } from 'src/hr/hr.attendanceEntity';
//import { Department } from "../employees/department.entity";
//import { CreateDepartmentDto, UpdateDepartmentDto } from "../employees/department.dto";
//import { AdminEntity } from '../employees/admin.entity';

@Controller('employees')
@UseInterceptors(ClassSerializerInterceptor) 
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() createEmployeesDto: CreateEmployeesDto): Promise<Employees> {
        try {
            return await this.employeesService.create(createEmployeesDto);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Employee creation failed',
                details: error.response?.message || error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll(): Promise<Employees[]> {
        return this.employeesService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number
    ): Promise<Employees> {
        return this.employeesService.findOne(id);
    }

    @Put(':id/status')
    @UsePipes(new ValidationPipe())
    async updateStatus(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body() updateEmployeesStatusDto: UpdateEmployeesStatusDto,
    ): Promise<Employees> {
        return this.employeesService.updateStatus(id, updateEmployeesStatusDto);
    }

   
@Get('inactive')
async findInactiveEmployees(): Promise<Employees[]> {
  return this.employeesService.findInactiveEmployees();
}

    @Get('older-than-40')
    async findEmployeesOlderThan40(): Promise<Employees[]> {
        return this.employeesService.findEmployeesOlderThan40();
    }
    @Get('email/:email')
async findByEmail(@Param('email') email: string): Promise<Employees | null> {
    const employee = await this.employeesService.findByEmail(email);
    if (!employee) {
        throw new NotFoundException(`Employee with email ${email} not found`);
    }
    return employee;
}

// @Get('departments-all') 
//   async getAllDepartments(): Promise<Department[]> {
//     return await this.employeesService.getAllDepartments();
//   }

    @Put(':id/profile')
    @UsePipes(new ValidationPipe())
    async updateProfile(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body() updateDto: UpdateEmployeeProfileDto,
    ): Promise<Employees> {
        return this.employeesService.updateProfile(id, updateDto);
    }

    @Put(':id/photo')
    async updatePhoto(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body('photoUrl') photoUrl: string,
    ): Promise<Employees> {
        if (!photoUrl) {
            throw new HttpException('Photo URL is required', HttpStatus.BAD_REQUEST);
        }
        return this.employeesService.updatePhoto(id, photoUrl);
    }

    @Put(':id/change-password')
@UsePipes(new ValidationPipe())
async changePassword(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
): Promise<{ message: string }> {
    const employee = await this.employeesService.findOne(id);
    
    // Verify current password
    const isPasswordValid = await this.employeesService.verifyPassword(
        changePasswordDto.currentPassword,
        employee.password
    );
    
    if (!isPasswordValid) {
        throw new HttpException('Current password is incorrect', HttpStatus.BAD_REQUEST);
    }
    
    // Update to new password
    await this.employeesService.updatePassword(id, changePasswordDto.newPassword);
    
    return { message: 'Password changed successfully' };
}
  ///attendence
   @Post(':id/attendance')
    @UsePipes(new ValidationPipe())
    async markAttendance(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body() createAttendanceDto: CreateAttendanceDto,
    ): Promise<AttendanceEntity> {
        // Verify the employee exists
        await this.employeesService.findOne(id);
        return this.employeesService.markAttendance(id, createAttendanceDto);
    }
     @Get(':id/attendance')
    async getEmployeeAttendance(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
    ): Promise<AttendanceEntity[]> {
        // Verify the employee exists
        await this.employeesService.findOne(id);
        return this.employeesService.getEmployeeAttendance(id);
    }
    // Employee can check in
    @Post(':id/check-in')
    async checkIn(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
    ): Promise<AttendanceEntity> {
        return this.employeesService.checkIn(id);
    }
     @Post(':id/check-out')
    async checkOut(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
    ): Promise<AttendanceEntity> {
        return this.employeesService.checkOut(id);
    }
}