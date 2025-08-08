import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Leave, LeaveStatus } from './leave.entity';
import { EmployeesService } from './employees.service';
import { CreateLeaveDto, UpdateLeaveStatusDto, UpdateLeaveDto } from './leave.dto';

@Injectable()
export class LeaveService {
    constructor(
        @InjectRepository(Leave)
        private leaveRepository: Repository<Leave>,
        private employeesService: EmployeesService,
    ) {}

    async create(createLeaveDto: CreateLeaveDto): Promise<Leave> {
        const employee = await this.employeesService.findOne(createLeaveDto.employeeId);
        
        // Check if dates are valid
        if (new Date(createLeaveDto.endDate) < new Date(createLeaveDto.startDate)) {
            throw new BadRequestException('End date cannot be before start date');
        }

        // Check for overlapping leave requests
        const overlappingLeave = await this.leaveRepository.findOne({
            where: {
                employeeId: createLeaveDto.employeeId,
                startDate: LessThanOrEqual(createLeaveDto.endDate),
                endDate: MoreThanOrEqual(createLeaveDto.startDate),
                status: LeaveStatus.APPROVED,
            }
        });

        if (overlappingLeave) {
            throw new BadRequestException('You already have an approved leave during this period');
        }

        const leave = this.leaveRepository.create({
            ...createLeaveDto,
            status: LeaveStatus.PENDING
        });

        return this.leaveRepository.save(leave);
    }

    async findAll(): Promise<Leave[]> {
        return this.leaveRepository.find({ relations: ['employee'] });
    }

    async findOne(id: number): Promise<Leave> {
        const leave = await this.leaveRepository.findOne({ 
            where: { id },
            relations: ['employee']
        });
        
        if (!leave) {
            throw new NotFoundException(`Leave with ID ${id} not found`);
        }
        return leave;
    }

    async updateStatus(id: number, updateDto: UpdateLeaveStatusDto): Promise<Leave> {
        const leave = await this.findOne(id);
        leave.status = updateDto.status;
        return this.leaveRepository.save(leave);
    }

    async update(id: number, updateDto: UpdateLeaveDto): Promise<Leave> {
        const leave = await this.findOne(id);
        
        if (updateDto.startDate && updateDto.endDate) {
            if (new Date(updateDto.endDate) < new Date(updateDto.startDate)) {
                throw new BadRequestException('End date cannot be before start date');
            }
        }

        Object.assign(leave, updateDto);
        return this.leaveRepository.save(leave);
    }

    async findByEmployee(employeeId: number): Promise<Leave[]> {
        return this.leaveRepository.find({ 
            where: { employeeId },
            relations: ['employee'],
            order: { startDate: 'DESC' }
        });
    }

    async findPending(): Promise<Leave[]> {
        return this.leaveRepository.find({ 
            where: { status: LeaveStatus.PENDING },
            relations: ['employee'],
            order: { appliedAt: 'ASC' }
        });
    }
}