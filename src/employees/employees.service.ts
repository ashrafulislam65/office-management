import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees, EmployeeStatus } from './employees.entity';
import { CreateEmployeesDto, UpdateEmployeesStatusDto, UpdateEmployeeProfileDto } from './employees.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class EmployeesService {
    private readonly SALT_ROUNDS = 12;
    constructor(
        @InjectRepository(Employees)
        private employeesRepository: Repository<Employees>,
    ) {}

     async create(createEmployeesDto: CreateEmployeesDto): Promise<Employees> {
        try {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(createEmployeesDto.password, this.SALT_ROUNDS);
            
            const employee = this.employeesRepository.create({
                ...createEmployeesDto,
                password: hashedPassword, // Store the hashed password
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
     async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }

    // Update this method to handle password changes securely
    async updatePassword(id: number, newPassword: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
        await this.employeesRepository.update(id, { password: hashedPassword });
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
     async updateProfile(id: number, updateDto: UpdateEmployeeProfileDto): Promise<Employees> {
        const employee = await this.findOne(id);
        
        if (updateDto.fullName) employee.fullName = updateDto.fullName;
        if (updateDto.phoneNumber) employee.phoneNumber = updateDto.phoneNumber;
        if (updateDto.department) employee.department = updateDto.department;
        if (updateDto.photoUrl) employee.photoUrl = updateDto.photoUrl;

        return this.employeesRepository.save(employee);
    }

    async updatePhoto(id: number, photoUrl: string): Promise<Employees> {
        const employee = await this.findOne(id);
        employee.photoUrl = photoUrl;
        return this.employeesRepository.save(employee);
    }
    
}