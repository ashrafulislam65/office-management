import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesService } from './employees/employees.service';
import { EmployeesController } from './employees/employees.controller';
import { HrService } from './hr/hr.service';
import { HrController } from './hr/hr.controller';

@Module({
  imports: [],
  controllers: [AppController, EmployeesController, HrController],
  providers: [AppService, EmployeesService, HrService],
})
export class AppModule {}
