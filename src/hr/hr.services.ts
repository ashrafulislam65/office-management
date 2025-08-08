import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateHrDto } from './dto/hr.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { HrEntity } from "./hr.entity";
import { Employees } from "src/employees/employees.entity";
import { CreateEmployeesDto } from "src/employees/employees.dto";
import { TaskEntity } from "./hr.hrTaskEntity";
import { CreateHrTaskDto } from "./dto/hr.hrTaskDto";
import { AttendanceEntity } from "./hr.attendanceEntity";
import { CreateAttendanceDto } from "./dto/hr.attendanceDto";
import { SalaryEntity } from "./hr.salaryEntity";
import { CreateSalaryDto, UpdateSalaryDto } from "./dto/hr.salaryDto";


@Injectable()
export class HrService{

    constructor(
        @InjectRepository(HrEntity)
        private readonly hrRepository: Repository<HrEntity>,

        @InjectRepository(Employees)
        private readonly employeeRepository: Repository<Employees>,

        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,

        @InjectRepository(AttendanceEntity)
        private readonly attendanceRepository: Repository<AttendanceEntity>,

        @InjectRepository(SalaryEntity)
        private readonly salaryRepository: Repository<SalaryEntity>,
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


    //Assgin Task
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

        const savedTask = await this.taskRepository.save(task);
        return await this.taskRepository.save(task);


    
    }


    //get task by hr id
    async getTasksByHrId(hrId: number): Promise<TaskEntity[]> {
        return await this.taskRepository.find({
            where: { assignedBy: { id: hrId } },
            relations: ['employee', 'assignedBy'], 
        });
    }



    //Update task
    async updateTask(id: number, dto: Partial<TaskEntity>): Promise<TaskEntity> {
        const task = await this.taskRepository.findOne({ where: { id } });

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        Object.assign(task, dto); // merge changes

        return await this.taskRepository.save(task);
    }

    //Delete task
    async deleteTask(id: number): Promise<{ message: string }> {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        await this.taskRepository.remove(task);
        return { message: `Task with ID ${id} deleted successfully` };
    }



    //Attendance
    async markAttendance(dto: CreateAttendanceDto): Promise<AttendanceEntity> {
    const employee = await this.employeeRepository.findOne({ where: { id: dto.employeeId } });

    if (!employee) {
        throw new NotFoundException('Employee not found');
    }

    const attendance = this.attendanceRepository.create({
        employee,
        empFullName: employee.fullName,
        date: dto.date,
        status: dto.status || 'present',
        checkInTime: dto.checkInTime,
        checkOutTime: dto.checkOutTime,
    });

    return this.attendanceRepository.save(attendance);
    }

    //Get Attendance
    async getAttendance(): Promise<AttendanceEntity[]> {
    return this.attendanceRepository.find({});
    }


    //Get Attendance buy employee Id
    async getAttendanceByEmployee(id: number): Promise<AttendanceEntity[]> {
    return this.attendanceRepository.find({
        where: { employee: { id } },
        order: { date: 'DESC' }
    });
    }

    //update attendance
    async updateAttendance(id: number, updateData: Partial<AttendanceEntity>): Promise<AttendanceEntity> {
    const attendance = await this.attendanceRepository.findOneBy({ id });
    if (!attendance) {
        throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    Object.assign(attendance, updateData);
    return this.attendanceRepository.save(attendance);
    }

    //delete attendace
    async deleteAttendance(id: number): Promise<void> {
    const result = await this.attendanceRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    }


    //Create salary
    async createSalary(salaryDto: CreateSalaryDto): Promise<SalaryEntity> {
        const employee = await this.employeeRepository.findOneBy({ id: salaryDto.employeeId });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${salaryDto.employeeId} not found`);
        }

        const hr = await this.hrRepository.findOneBy({ id: salaryDto.paidById });
        if (!hr) {
            throw new NotFoundException(`HR with ID ${salaryDto.paidById} not found`);
        }

        const salary = this.salaryRepository.create({
            amount: salaryDto.amount,
            payDate: salaryDto.payDate,
            paymentMethod: salaryDto.paymentMethod,
            bonus: salaryDto.bonus,
            employee: employee,
            paidBy: hr,
        });

        return this.salaryRepository.save(salary);
    }


    async getAll(): Promise<SalaryEntity[]> {
        return this.salaryRepository.find();
    }

    async getSalaryById(id: number): Promise<SalaryEntity> {
    const salary = await this.salaryRepository.findOneBy({ id });
    if (!salary) {
        throw new NotFoundException(`Salary record not found for ID ${id}`);
    }
    return salary;
}

    async updateSalary(id: number, updateSalaryDto: UpdateSalaryDto): Promise<SalaryEntity> {
        await this.salaryRepository.update(id, updateSalaryDto);
        const updatedSalary = await this.salaryRepository.findOneBy({ id });

        if (!updatedSalary) {
            throw new NotFoundException(`Salary with ID ${id} not found`);
        }

        return updatedSalary;
    }


    async deleteSalary(id: number): Promise<void> {
        await this.salaryRepository.delete(id);
    }

    async getSalariesByEmployeeId(employeeId: number): Promise<SalaryEntity[]> {
        return this.salaryRepository.find({
        where: { employee: { id: employeeId } },
        });
    }









}