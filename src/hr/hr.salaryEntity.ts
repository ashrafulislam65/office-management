import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employees } from '../employees/employees.entity';
import { HrEntity } from './hr.entity';

@Entity()
export class SalaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employees, (employee) => employee.id, { eager: true })
  employee: Employees;

  @ManyToOne(() => HrEntity, (hr) => hr.id, { eager: true })
  paidBy: HrEntity;

  @Column()
  amount: number;

  @Column()
  payDate: Date;

  @Column()
  paymentMethod: string; // Bank Transfer, Cash, etc.

  @Column({ nullable: true })
  bonus: number;

  
}
