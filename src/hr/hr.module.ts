import { Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrEntity } from './hr.entity';
import { Employees } from 'src/employees/employees.entity';
import { TaskEntity } from './hr.hrTaskEntity';
import { AttendanceEntity } from './hr.attendanceEntity';
import { SalaryEntity } from './hr.salaryEntity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HrEntity,
      Employees,
      TaskEntity,
      AttendanceEntity,
      SalaryEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: 'rafsan-hr-part-on-office-project-for-web-tech',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
