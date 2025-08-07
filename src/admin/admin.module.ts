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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity, 
      Department,
      Employees // Add this entity
    ])
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}