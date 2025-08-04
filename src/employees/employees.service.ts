import { Injectable } from '@nestjs/common';
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
        const employee = this.employeesRepository.create({
            ...createEmployeesDto,
            status: 'active' // Default status as per requirements
        });
        return this.employeesRepository.save(employee);
    }

    async updateStatus(id: number, updateEmployeesStatusDto: UpdateEmployeesStatusDto): Promise<Employees> {
        const employee = await this.employeesRepository.findOne({ where: { id } });
        if (!employee) {
            throw new Error('Employee not found');
        }
        employee.status = updateEmployeesStatusDto.status;
        return this.employeesRepository.save(employee);
    }

    async findInactiveEmployees(): Promise<Employees[]> {
        return this.employeesRepository.find({ where: { status: 'inactive' } });
    }

    async findEmployeesOlderThan40(): Promise<Employees[]> {
        return this.employeesRepository
            .createQueryBuilder('employee')
            .where('employee.age > :age', { age: 40 })
            .getMany();
    }
}