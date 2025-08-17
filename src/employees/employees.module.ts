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
import { MailModule } from './mail.module';
import { EmployeeTask } from 'src/admin/employee-task.entity';
import { AdminEntity } from 'src/admin/admin.entity';
import { Department } from 'src/admin/department.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Employees, Leave,AttendanceEntity,Memorandum,MailModule,EmployeeTask,AdminEntity,Department])],
    providers: [EmployeesService, LeaveService],
    controllers: [EmployeesController, LeaveController],
    exports: [EmployeesService, TypeOrmModule],
})
export class EmployeesModule {}