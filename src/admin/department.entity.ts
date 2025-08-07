// // department.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// export enum DepartmentType {
//   SOFTWARE_ENGINEER = 'Software Engineer',
//   TECHNICAL_SUPPORTER = 'Technical Supporter',
//   NETWORK_ENGINEER = 'Network Engineer',
// }

// @Entity("departments")

// export class Department {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ name: "employee_id" })  // Reference by ID only
//   employeeId: number;

//   @Column({
//     type: "enum",
//     enum: DepartmentType,
//     default: DepartmentType.SOFTWARE_ENGINEER
//   })
//   department: DepartmentType;

//   @Column()
//   role: string;
// }

// department.entity.ts
 // department.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';
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

  @ManyToOne(() => AdminEntity, admin => admin.departments)
  @JoinColumn({ name: 'adminId' })
  admin: AdminEntity;

  @ManyToOne(() => Employees, employee => employee.departments)
  @JoinColumn({ name: 'employeeId' })
  employee: Employees;

  @Column({ nullable: true })
  joiningDate: Date;

  @Column({ default: true })
  isActive: boolean;
}