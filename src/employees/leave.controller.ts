import { Body, Controller, Get, Post, Put, Param, UsePipes, ValidationPipe, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto, UpdateLeaveStatusDto, UpdateLeaveDto } from './leave.dto';
import { Leave } from './leave.entity';

@Controller('leave')
export class LeaveController {
    constructor(private readonly leaveService: LeaveService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() createLeaveDto: CreateLeaveDto): Promise<Leave> {
        try {
            return await this.leaveService.create(createLeaveDto);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Leave application failed',
                details: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll(): Promise<Leave[]> {
        return this.leaveService.findAll();
    }

    @Get('pending')
    async findPending(): Promise<Leave[]> {
        return this.leaveService.findPending();
    }

    @Get(':id')
    async findOne(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number
    ): Promise<Leave> {
        return this.leaveService.findOne(id);
    }

    @Get('employee/:employeeId')
    async findByEmployee(
        @Param('employeeId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) employeeId: number
    ): Promise<Leave[]> {
        return this.leaveService.findByEmployee(employeeId);
    }

    @Put(':id/status')
    @UsePipes(new ValidationPipe())
    async updateStatus(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body() updateLeaveStatusDto: UpdateLeaveStatusDto,
    ): Promise<Leave> {
        return this.leaveService.updateStatus(id, updateLeaveStatusDto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async update(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body() updateLeaveDto: UpdateLeaveDto,
    ): Promise<Leave> {
        return this.leaveService.update(id, updateLeaveDto);
    }
}