import { Body, Controller, Get, Post, Put, Param, UsePipes, ValidationPipe, ParseIntPipe, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeesDto, UpdateEmployeesStatusDto } from './employees.dto';
import { Employees } from './employees.entity';

@Controller('employees')
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
}