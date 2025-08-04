import { Body, Controller, Get, Post, Put, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeesDto, UpdateEmployeesStatusDto } from './employees.dto';
import { Employees } from './employees.entity';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createEmployeesDto: CreateEmployeesDto): Promise<Employees> {
        return this.employeesService.create(createEmployeesDto);
    }

    @Put(':id/status')
    @UsePipes(new ValidationPipe())
    async updateStatus(
        @Param('id') id: string,
        @Body() updateEmployeesStatusDto: UpdateEmployeesStatusDto,
    ): Promise<Employees> {
        return this.employeesService.updateStatus(Number(id), updateEmployeesStatusDto);
    }

    @Get('inactive')
    async findInactiveEmployees(): Promise<Employees[]> {
        return this.employeesService.findInactiveEmployees();
    }

    @Get('older-than-40')
    async findEmployeesOlderThan40(): Promise<Employees[]> {
        return this.employeesService.findEmployeesOlderThan40();
    }
}