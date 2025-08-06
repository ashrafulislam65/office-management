import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employees } from './employees.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Employees])], 
    controllers: [EmployeesController],
    providers: [EmployeesService],
    exports: [EmployeesService, TypeOrmModule],
})
export class EmployeesModule {}