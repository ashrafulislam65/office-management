import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees, EmployeeStatus } from './employees.entity';
import { CreateEmployeesDto, UpdateEmployeesStatusDto } from './employees.dto';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employees)
        private employeesRepository: Repository<Employees>,
    ) {}

    async create(createEmployeesDto: CreateEmployeesDto): Promise<Employees> {
        try {
            const employee = this.employeesRepository.create({
                ...createEmployeesDto,
                status: EmployeeStatus.ACTIVE, 
                salary: createEmployeesDto.salary || 0,
                department: createEmployeesDto.department || 'General'
            });
            return await this.employeesRepository.save(employee);
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('Email already exists');
            }
            throw new BadRequestException('Failed to create employee');
        }
    }

    async findAll(): Promise<Employees[]> {
        return this.employeesRepository.find();
    }

    async findOne(id: number): Promise<Employees> {
        const employee = await this.employeesRepository.findOne({ 
            where: { id }
        });
        
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }

    async updateStatus(id: number, updateDto: UpdateEmployeesStatusDto): Promise<Employees> {
        const employee = await this.findOne(id);
        employee.status = updateDto.status;
        return this.employeesRepository.save(employee);
    }

    async findInactiveEmployees(): Promise<Employees[]> {
        return this.employeesRepository.find({
            where: {
                status: EmployeeStatus.INACTIVE
            }
        });
    }

    async findEmployeesOlderThan40(): Promise<Employees[]> {
        return this.employeesRepository.createQueryBuilder('employee')
            .where('employee.age > :age', { age: 40 })
            .getMany();
    }

    async findByEmail(email: string): Promise<Employees | undefined> {
        const employee = await this.employeesRepository.findOne({ where: { email } });
        return employee === null ? undefined : employee;
    }
}