
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';

// import { Employees } from '../employees/employees.entity';
import { AdminEntity } from './admin.entity';
import { Employees } from 'src/employees/employees.entity';

export enum EmployeeTaskStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted'
}

@Entity('employee_tasks')
export class EmployeeTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text') // Fixed from 'test' to 'text'
  description: string;

  @Column({ type:'varchar',nullable:true})
  url: string | null;

  @CreateDateColumn()
  assignedAt: Date; // Fixed typo from 'assignAt'

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({
    type: 'enum',
    enum: EmployeeTaskStatus,
    default: EmployeeTaskStatus.PENDING
  })
  status: EmployeeTaskStatus;

  @Column({type:'varchar', nullable: true })
  submissionUrl: string;

  // Remove @IsNotEmpty and @IsNumber decorators from here
  // These should only be in DTOs, not entities

  @ManyToOne(() => AdminEntity, admin => admin.assignedEmployeeTasks)
  assignedBy: AdminEntity;

//   @ManyToOne(() => Employees, employee => employee.tasks)
//   assignedTo: Employees;

  @UpdateDateColumn()
  updatedAt: Date;
  //emp
   @ManyToOne(() => Employees, employee => employee.tasks)
  assignedTo: Employees;
}