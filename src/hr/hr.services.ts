import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHrDto } from './dto/hr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { HrEntity } from './hr.entity';
import { Employees } from 'src/employees/employees.entity';
import { CreateEmployeesDto } from 'src/employees/employees.dto';
import { TaskEntity } from './hr.hrTaskEntity';
import { CreateHrTaskDto } from './dto/hr.hrTaskDto';
import { AttendanceEntity } from './hr.attendanceEntity';
import { CreateAttendanceDto } from './dto/hr.attendanceDto';
import { SalaryEntity } from './hr.salaryEntity';
import { CreateSalaryDto, UpdateSalaryDto } from './dto/hr.salaryDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Memorandum } from 'src/admin/memorandum.entity';
import { Task } from 'src/admin/task.entity';
import { UpdateTaskDto } from 'src/admin/task.dto';

@Injectable()
export class HrService {
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

    @InjectRepository(Memorandum)
    private readonly memorandumRepository: Repository<Memorandum>,

    @InjectRepository(Task)
    private readonly adminTaskRepository: Repository<Task>,

    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  getDashboardData(): string {
    return 'Dashboard data for HR.';
  }

  getHrId(id: number): string {
    return `Admin ID: ${id}`;
  }

  //Create new Hr
  async createHr(createHrDto: CreateHrDto): Promise<HrEntity> {
    const existingUser = await this.hrRepository.findOne({
      where: { username: createHrDto.username },
    });
    if (existingUser) {
      throw new BadRequestException(
        `Username "${createHrDto.username}" already exists`,
      );
    }
    const existingEmail = await this.hrRepository.findOne({
      where: { email: createHrDto.email },
    });
    if (existingEmail) {
      throw new BadRequestException(
        `Email "${createHrDto.email}" already exists`,
      );
    }
    const existingPhone = await this.hrRepository.findOne({
      where: { phone: createHrDto.phone },
    });
    if (existingPhone) {
      throw new BadRequestException(
        `Phone "${createHrDto.phone}" already exists`,
      );
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createHrDto.password, salt);
    createHrDto.password = passwordHash;

    const newHr = this.hrRepository.create(createHrDto);
    return await this.hrRepository.save(newHr);
  }

  // Retrieve Hr whose full name contains a substring
  async findHrByFullName(substring: string): Promise<HrEntity[]> {
    return await this.hrRepository.find({
      where: {
        fullName: ILike(`%${substring}%`),
      },
    });
  }

  // Retrieve a Hr by unique username
  async findHrByUsername(username: string): Promise<HrEntity> {
    const user = await this.hrRepository.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return user;
  }

  // Remove a Hr by username
  async removeHrByUsername(username: string): Promise<void> {
    const result = await this.hrRepository.delete({
      username,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
  }

  // Update a Hr by username
  async updateHrByUsername(
    username: string,
    updateData: Partial<CreateHrDto>,
  ): Promise<HrEntity> {
    const hr = await this.hrRepository.findOne({ where: { username } });

    if (!hr) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    if (updateData.username && updateData.username !== hr.username) {
      const existingUser = await this.hrRepository.findOne({
        where: { username: updateData.username },
      });
      if (existingUser) {
        throw new BadRequestException(
          `Username "${updateData.username}" already exists`,
        );
      }
    }
    if (updateData.email && updateData.email !== hr.email) {
      const existingEmail = await this.hrRepository.findOne({
        where: { email: updateData.email },
      });
      if (existingEmail) {
        throw new BadRequestException(
          `Email "${updateData.email}" already exists`,
        );
      }
    }

    if (updateData.phone && updateData.phone !== hr.phone) {
      const existingPhone = await this.hrRepository.findOne({
        where: { phone: updateData.phone },
      });
      if (existingPhone) {
        throw new BadRequestException(
          `Phone "${updateData.phone}" already exists`,
        );
      }
    }
    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    Object.assign(hr, updateData);

    return await this.hrRepository.save(hr);
  }

  //Create Employee
  async createEmployee(employeeData: Partial<Employees>): Promise<Employees> {
    const newEmployee = this.employeeRepository.create(employeeData);
    return await this.employeeRepository.save(newEmployee);
  }

  // Retrieve an employee by unique username
  async findEmployeeByUsername(id: number): Promise<Employees> {
    const user = await this.employeeRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with username "${id}" not found`);
    }
    return user;
  }

  //Update Employee
  async updateEmployee(
    id: number,
    employeeData: Partial<CreateEmployeesDto>,
  ): Promise<Employees> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`User with username "${id}" not found`);
    }

    Object.assign(employee, employeeData);

    return await this.employeeRepository.save(employee);
  }

  // Remove Employee
  async removeEmployee(id: number): Promise<void> {
    const result = await this.employeeRepository.delete({
      id,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`User with username "${id}" not found`);
    }
  }

  //Assgin Task
  async assignTask(dto: CreateHrTaskDto): Promise<any> {
    const employee = await this.employeeRepository.findOne({
      where: { id: dto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${dto.employeeId} not found`,
      );
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
    const employee = await this.employeeRepository.findOne({
      where: { id: dto.employeeId },
    });

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
      order: { date: 'DESC' },
    });
  }

  //update attendance
  async updateAttendance(
    id: number,
    updateData: Partial<AttendanceEntity>,
  ): Promise<AttendanceEntity> {
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
    const employee = await this.employeeRepository.findOneBy({
      id: salaryDto.employeeId,
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${salaryDto.employeeId} not found`,
      );
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
      empFullName: employee.fullName,
      paidByFullName: hr.fullName,
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

  async updateSalary(
    id: number,
    updateSalaryDto: UpdateSalaryDto,
  ): Promise<SalaryEntity> {
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

  //Sign In

  async hrSignIn(email: string, password: string): Promise<{ token: string }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.hrRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    }

    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  //Mailer Forget And Reset Password

  async forgotPassword(email: string): Promise<{ message: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailerService.sendMail({
      to: email,
      from: '"No Reply" <n201033.rafsanyeasir@gmail.com>',
      subject: 'Password Reset Code',
      text: `Your Forget password code is ${code}`,
    });

    return { message: 'Password reset code sent' };
  }

  //Get all memorandum
  async findAllMemorandum(): Promise<Memorandum[]> {
    return this.memorandumRepository.find({ relations: ['recipient'] });
  }

  // Get all admin tasks for a specific HR (assignedTo)
  async getAdminTasksByHrId(hrId: number): Promise<Task[]> {
    const hr = await this.hrRepository.findOne({ where: { id: hrId } });
    if (!hr) {
      throw new NotFoundException(`HR with ID ${hrId} not found`);
    }

    return this.adminTaskRepository.find({
      where: { assignedTo: { id: hrId } },
      relations: ['assignedTo', 'assignedBy'],
    });
  }
}
