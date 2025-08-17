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
import { MailerModule } from '@nestjs-modules/mailer';

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
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'n201033.rafsanyeasir@gmail.com',
          pass: 'bcmvbpezguoahkbh',
        },
      },
      defaults: {
        from: '"No Reply" <n201033.rafsanyeasir@gmail.com>',
      },
    }),
  ],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
