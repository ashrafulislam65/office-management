import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
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
                status: 'active'
            });
            return await this.employeesRepository.save(employee);
        } catch (error) {
            throw new BadRequestException('Failed to create employee');
        }
    }

    async findAll(): Promise<Employees[]> {
        return this.employeesRepository.find();
    }

    async findOne(id: number): Promise<Employees> {
        if (isNaN(id)) {
            throw new BadRequestException('Invalid employee ID');
        }

        const employee = await this.employeesRepository.findOne({ 
            where: { id }
        });
        
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }

    async updateStatus(id: number, updateEmployeesStatusDto: UpdateEmployeesStatusDto): Promise<Employees> {
        const employee = await this.findOne(id); // Reuse findOne which includes validation
        employee.status = updateEmployeesStatusDto.status;
        return this.employeesRepository.save(employee);
    }

   async findInactiveEmployees(): Promise<Employees[]> {
    try {
        return await this.employeesRepository.find({ 
            where: { status: 'inactive' }
        });
    } catch (error) {
        console.error('Error fetching inactive employees:', error);
        throw new BadRequestException('Could not fetch inactive employees');
    }
}

    async findEmployeesOlderThan40(): Promise<Employees[]> {
        return this.employeesRepository
            .createQueryBuilder('employee')
            .where('employee.age > :age', { age: 40 })
            
            .getMany();
    }
}