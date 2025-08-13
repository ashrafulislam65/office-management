// // src/admin/admin.module.ts
// import { Module } from '@nestjs/common';
// import { AdminController } from './admin.controller';
// import { AdminService } from './admin.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AdminEntity } from './admin.entity';
// import { Department } from './department.entity';
// import { CreateDepartmentDto,UpdateDepartmentDto } from './department.dto';

// @Module({
//   imports: [TypeOrmModule.forFeature([AdminEntity, Department])],
//   controllers: [AdminController],
//   providers: [AdminService],
// })
// export class AdminModule {}

// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { Department } from './department.entity';
import { Employees } from '../employees/employees.entity'; // Add this import
import { Memorandum } from './memorandum.entity';
import{ Task } from './task.entity'; // Import Task entity
import { HrEntity } from '../hr/hr.entity';
import { EmployeeTask } from './employee-task.entity';
import { EmailModule } from './email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity, 
      Department,
      Employees,
      Memorandum ,
      Task,
      HrEntity,
      EmployeeTask
      

    ]),
    EmailModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}