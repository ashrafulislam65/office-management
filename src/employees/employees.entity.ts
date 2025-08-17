import { Entity, PrimaryGeneratedColumn, Column, Index, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Leave } from './leave.entity';
import { Exclude } from 'class-transformer';
import { Memorandum } from 'src/admin/memorandum.entity';
import { EmployeeTask } from 'src/admin/employee-task.entity';
import { Department } from 'src/admin/department.entity';
export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
@Entity()
export class Employees {
   
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ length: 100 })
    fullName: string;

    @Column({ unsigned: true })
    age: number;

   @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE
  })
  status: EmployeeStatus;

    @Column()
    @Index({ unique: true }) // This makes email unique and creates an index
    email: string;

     @Column()
    @Exclude() // This will exclude the password from serialization
    password: string;

    @Column()
    gender: string;

    @Column()
    phoneNumber: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true})
    salary: number;

    @Column({nullable: true, default: 'General'})
    department: string;
     @Column({ nullable: true })
    photoUrl: string; 
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
     @OneToMany(() => Leave, leave => leave.employee)
    leaves: Leave[];
    //memorandum
    // Add this to your Employees entity
   @OneToMany(() => Memorandum, memorandum => memorandum.recipient)
   memorandums: Memorandum[];
   //task
   @OneToMany(() => EmployeeTask, task => task.assignedTo)
  tasks: EmployeeTask[];
   @OneToMany(() => Department, department => department.employee)
  departments: Department[];
}