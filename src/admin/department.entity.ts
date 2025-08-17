// src/admin/department.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employees } from '../employees/employees.entity';

export enum DepartmentType {
  SOFTWARE_ENGINEER = 'Software Engineer',
  TECHNICAL_SUPPORTER = 'Technical Supporter',
  NETWORK_ENGINEER = 'Network Engineer',
}

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DepartmentType,
    default: DepartmentType.SOFTWARE_ENGINEER
  })
  departmentType: DepartmentType;

  @Column()
  role: string;

  @ManyToOne(() => Employees, employee => employee.departments)
  @JoinColumn({ name: 'employeeId' })
  employee: Employees;

  @Column({ nullable: true })
  joiningDate: Date;

  @Column({ default: true })
  isActive: boolean;
}