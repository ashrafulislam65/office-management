import { Module } from "@nestjs/common";
import { HrController } from "./hr.controller";
import { HrService } from "./hr.services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HrEntity } from "./hr.entity";
import { Employees } from "src/employees/employees.entity";
import { TaskEntity } from "./hr.hrTaskEntity";
import { AttendanceEntity } from "./hr.attendanceEntity";
import { SalaryEntity } from "./hr.salaryEntity";



@Module({
    imports: [ TypeOrmModule.forFeature([HrEntity, Employees, TaskEntity, AttendanceEntity, SalaryEntity]),],
    controllers:[HrController],
    providers: [HrService],
})

export class HrModule{}