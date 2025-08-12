import { EmployeeTask } from 'src/admin/employee-task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Employees {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    fullName: string;

    @Column({ unsigned: true })
    age: number;

    @Column({ default: 'active' })
    status: 'active' | 'inactive';

    // Additional fields you might need
    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    gender: string;

     @Column()
     phoneNumber: string;
  departments: any;
     memorandums: any;


    @OneToMany(()=>EmployeeTask,task=>task.assignedTo)
    tasks: EmployeeTask[];
  //departments: any;
   
}