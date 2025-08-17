import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employees } from './employees.entity';
import { Leave } from './leave.entity';
import { EmployeesService } from './employees.service';
import { LeaveService } from './leave.service';
import { EmployeesController } from './employees.controller';
import { LeaveController } from './leave.controller';
import { AttendanceEntity } from 'src/hr/hr.attendanceEntity';
import { Memorandum } from 'src/admin/memorandum.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Employees, Leave,AttendanceEntity,Memorandum])],
    providers: [EmployeesService, LeaveService],
    controllers: [EmployeesController, LeaveController],
    exports: [EmployeesService, TypeOrmModule],
})
export class EmployeesModule {}