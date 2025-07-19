import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesService } from './employees/employees.service';
import { EmployeesController } from './employees/employees.controller';
import { HrService } from './hr/hr.service';
import { HrController } from './hr/hr.controller';
import { Hr1Controller } from './hr1/hr1.controller';

@Module({
  imports: [],
  controllers: [AppController, EmployeesController, HrController, Hr1Controller],
  providers: [AppService, EmployeesService, HrService],
})
export class AppModule {}
