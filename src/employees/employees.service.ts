import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Employees, EmployeeStatus } from './employees.entity';
import { CreateEmployeesDto, UpdateEmployeesStatusDto, UpdateEmployeeProfileDto } from './employees.dto';
import * as bcrypt from 'bcrypt';
import { AttendanceEntity } from 'src/hr/hr.attendanceEntity';
import { CreateAttendanceDto } from 'src/hr/dto/hr.attendanceDto';
import { Memorandum } from 'src/admin/memorandum.entity';

@Injectable()
export class EmployeesService {
    private readonly SALT_ROUNDS = 12;
    constructor(
        @InjectRepository(Employees)
        private employeesRepository: Repository<Employees>,
        // Inject other services if needed
         @InjectRepository(AttendanceEntity)
        private attendanceRepository: Repository<AttendanceEntity>,
         @InjectRepository(Memorandum)
        private memorandumRepository: Repository<Memorandum>,
       
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
    
    ///attendence
      async markAttendance(id: number, createAttendanceDto: CreateAttendanceDto): Promise<AttendanceEntity> {
        const employee = await this.findOne(id);
        
        // Check if attendance already exists for this date
        const existingAttendance = await this.attendanceRepository.findOne({
            where: {
                employee: { id },
                date: createAttendanceDto.date
            }
        });

        if (existingAttendance) {
            throw new HttpException('Attendance already marked for this date', HttpStatus.BAD_REQUEST);
        }

        const attendance = this.attendanceRepository.create({
            ...createAttendanceDto,
            employee,
            empFullName: employee.fullName,
            status: createAttendanceDto.status || 'present'
        });

        return this.attendanceRepository.save(attendance);
    }

    async getEmployeeAttendance(id: number): Promise<AttendanceEntity[]> {
        return this.attendanceRepository.find({
            where: { employee: { id } },
            order: { date: 'DESC' }
        });
    }
      async checkIn(id: number): Promise<AttendanceEntity> {
        const employee = await this.findOne(id);
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toTimeString().split(' ')[0];
        
        let attendance = await this.attendanceRepository.findOne({
            where: {
                employee: { id },
                date: today
            }
        });

        if (!attendance) {
            attendance = this.attendanceRepository.create({
                employee,
                empFullName: employee.fullName,
                date: today,
                status: 'present',
                checkInTime: now
            });
        } else if (attendance.checkInTime) {
            throw new HttpException('Already checked in today', HttpStatus.BAD_REQUEST);
        } else {
            attendance.checkInTime = now;
            attendance.status = 'present';
        }

        return this.attendanceRepository.save(attendance);
    }
     async checkOut(id: number): Promise<AttendanceEntity> {
        const employee = await this.findOne(id);
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toTimeString().split(' ')[0];
        
        const attendance = await this.attendanceRepository.findOne({
            where: {
                employee: { id },
                date: today
            }
        });

        if (!attendance) {
            throw new HttpException('You need to check in first', HttpStatus.BAD_REQUEST);
        }

        if (!attendance.checkInTime) {
            throw new HttpException('You need to check in first', HttpStatus.BAD_REQUEST);
        }

        if (attendance.checkOutTime) {
            throw new HttpException('Already checked out today', HttpStatus.BAD_REQUEST);
        }

        attendance.checkOutTime = now;
        return this.attendanceRepository.save(attendance);
    }

    // Get monthly attendance summary
    async getMonthlyAttendanceSummary(id: number, year: number, month: number): Promise<{present: number, absent: number, late: number}> {
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        
        const attendances = await this.attendanceRepository.find({
            where: {
                employee: { id },
                date: Between(startDate, endDate)
            }
        });

        const summary = {
            present: 0,
            absent: 0,
            late: 0
        };

        attendances.forEach(att => {
            if (att.status === 'present') summary.present++;
            else if (att.status === 'absent') summary.absent++;
            else if (att.status === 'late') summary.late++;
        });

        return summary;
    }
    // get memorandum
   // QueryBuilder ব্যবহার করুন
async getEmployeeMemorandums(employeeId: number): Promise<Memorandum[]> {
  return this.memorandumRepository
    .createQueryBuilder('memorandum')
    .leftJoinAndSelect('memorandum.admin', 'admin')
    .where('memorandum.recipientId = :employeeId', { employeeId })
    .orderBy('memorandum.createdAt', 'DESC')
    .getMany();
}

async getMemorandumDetails(employeeId: number, memorandumId: string): Promise<Memorandum> {
  const memorandum = await this.memorandumRepository
    .createQueryBuilder('memorandum')
    .leftJoinAndSelect('memorandum.admin', 'admin')
    .where('memorandum.id = :memorandumId', { memorandumId })
    .andWhere('memorandum.recipientId = :employeeId', { employeeId })
    .getOne();

  if (!memorandum) {
    throw new NotFoundException('Memorandum not found or not authorized');
  }

  return memorandum;
}
//login 
async validateEmployee(email: string, password: string): Promise<Employees> {
    const employee = await this.employeesRepository.findOne({ 
      where: { email } 
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (employee.status !== EmployeeStatus.ACTIVE) {
      throw new HttpException('Account is not active', HttpStatus.FORBIDDEN);
    }

    return employee;
  }
     
}