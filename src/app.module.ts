import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesService } from './employees/employees.service';
import { EmployeesController } from './employees/employees.controller';
import { HrController } from './hr/hr.controller';
import { HrService } from './hr/hr.services';
import { HrModule } from './hr/hr.module';

@Module({
  imports: [HrModule],
  controllers: [AppController, EmployeesController, HrController],
  providers: [AppService, EmployeesService, HrService],
})
export class AppModule {}
