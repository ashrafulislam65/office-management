import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateHrDto } from './dto/hr.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { HrEntity } from "./hr.entity";
import { Employees } from "src/employees/employees.entity";
import { CreateEmployeesDto } from "src/employees/employees.dto";
import { TaskEntity } from "./hr.hrTaskEntity";
import { CreateHrTaskDto } from "./dto/hr.hrTaskDto";


@Injectable()
export class HrService{

    constructor(
        @InjectRepository(HrEntity)
        private readonly hrRepository: Repository<HrEntity>,

        @InjectRepository(Employees)
        private readonly employeeRepository: Repository<Employees>,

        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
    ){}
    getDashboardData():string{
        return 'Dashboard data for HR.'
    }

    getHrId(id: number): string {
        return `Admin ID: ${id}`
    }
    

    //Create new Hr
    async createHr(createHrDto: CreateHrDto): Promise<HrEntity>{
        const newHr = this.hrRepository.create(createHrDto);
        return await this.hrRepository.save(newHr);
    }

    // Retrieve Hr whose full name contains a substring
    async findHrByFullName(substring: string): Promise<HrEntity[]> {
        return await this.hrRepository.find({
        where: { 
            fullName: ILike(`%${substring}%`) 
        },
        });
    }

    // Retrieve a Hr by unique username
    async findHrByUsername(username: string): Promise<HrEntity> {
        const user = await this.hrRepository.findOne({ 
            where: { 
                username 
            } });
        if (!user) {
        throw new NotFoundException(`User with username "${username}" not found`);
        }
        return user;
    }

    // Remove a Hr by username
    async removeHrByUsername(username: string): Promise<void> {
        const result = await this.hrRepository.delete({ 
            username 
        });
        if (result.affected === 0) {
        throw new NotFoundException(`User with username "${username}" not found`);
        }
    }

    // Update a Hr by username
    async updateHrByUsername(username: string, updateData: Partial<CreateHrDto>): Promise<HrEntity> {
        const hr = await this.hrRepository.findOne({ where: { username } });

        if (!hr) {
            throw new NotFoundException(`User with username "${username}" not found`);
        }

        Object.assign(hr, updateData);

        return await this.hrRepository.save(hr);
    }


    //Create Employee
    async createEmployee(employeeData: Partial<Employees>): Promise<Employees> {
        const newEmployee = this.employeeRepository.create(employeeData);
        return await this.employeeRepository.save(newEmployee);
    }

    //Update Employee
    async updateEmployee(id: number, employeeData: Partial<CreateEmployeesDto>): Promise<Employees>{
        const employee = await this.employeeRepository.findOne({
            where: {id}
        })

        if (!employee) {
            throw new NotFoundException(`User with username "${id}" not found`);
        }

        Object.assign(employee, employeeData);

        return await this.employeeRepository.save(employee);
    }

    // Remove Employee
    async removeEmployee(id: number): Promise<void> {
        const result = await this.employeeRepository.delete({ 
            id
        });
        if (result.affected === 0) {
        throw new NotFoundException(`User with username "${id}" not found`);
        }
    }

    async assignTask(dto: CreateHrTaskDto): Promise<any> {
        const employee = await this.employeeRepository.findOne({ where: { id: dto.employeeId } });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${dto.employeeId} not found`);
        }

        const hr = await this.hrRepository.findOne({ where: { id: dto.hrId } });
        if (!hr) {
            throw new NotFoundException(`HR with ID ${dto.hrId} not found`);
        }

        // Create task without formatting employee/hr fields here
        const task = this.taskRepository.create({
            taskTitle: dto.taskTitle,
            description: dto.description,
            assignedDate: dto.assignedDate,
            dueDate: dto.dueDate,
            employee,
            assignedBy: hr,
            empFullName: employee.fullName,
            hrFullName: hr.fullName,
            status: dto.status || 'pending',
        });

        // Save the task to DB
        const savedTask = await this.taskRepository.save(task);

    
    }

    
    async getAllTasks(): Promise<TaskEntity[]> {
        return await this.taskRepository.find();
    }

    async getTasksByEmployee(employeeId: number): Promise<TaskEntity[]> {
        return await this.taskRepository.find({
            where: { employee: { id: employeeId } },
        });
    }

    async getHrIdsAndNames(): Promise<{ id: number; fullName: string }[]> {
        return await this.hrRepository.find({
            select: ['id', 'fullName'],
        });
    }


    async getEmployeeIdsAndNames(): Promise<{ id: number; fullName: string }[]> {
        return await this.employeeRepository.find({
            select: ['id', 'fullName'],
        });
    }



}