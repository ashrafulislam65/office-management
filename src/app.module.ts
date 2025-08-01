import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesService } from './employees/employees.service';
import { EmployeesController } from './employees/employees.controller';
import { HrController } from './hr/hr.controller';
import { HrService } from './hr/hr.services';
import { HrModule } from './hr/hr.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './hr/hr.entity';

@Module({
  imports: [HrModule, TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'dpg-d25r49a4d50c73fjma40-a.singapore-postgres.render.com',
      port: 5432,
      username: 'office_management_taln_user',
      password: 'jHyLtss6t2w1s0DWYwMYn25tnmoT0GE2',
      database: 'office_management_taln',
      autoLoadEntities: true,
      synchronize: true,
      extra : {
        ssl: {
          rejectUnauthorized: false,
        }
      }
      } ),
      TypeOrmModule.forFeature([EmployeeEntity]), 
],
  controllers: [AppController, EmployeesController, HrController],
  providers: [AppService, EmployeesService, HrService],
})
export class AppModule {}

