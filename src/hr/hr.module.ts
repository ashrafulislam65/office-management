import { Module } from "@nestjs/common";
import { HrController } from "./hr.controller";
import { HrService } from "./hr.services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HrEntity } from "./hr.entity";
import { Employees } from "src/employees/employees.entity";
import { TaskEntity } from "./hr.hrTaskEntity";



@Module({
    imports: [ TypeOrmModule.forFeature([HrEntity, Employees, TaskEntity]),],
    controllers:[HrController],
    providers: [HrService],
})

export class HrModule{}