import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EmployeesModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d25r49a4d50c73fjma40-a.singapore-postgres.render.com',
      port: 5432,
      username: 'office_management_taln_user',
      password: 'jHyLtss6t2w1s0DWYwMYn25tnmoT0GE2',
      database: 'office_management_taln',
      autoLoadEntities: true,  // This will automatically load your entities
      synchronize: true,       // Be careful with this in production
      extra: {
        ssl: {
          rejectUnauthorized: false,
        }
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}