import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn ,OneToMany} from "typeorm";
import * as bcrypt from 'bcrypt';

import { BadRequestException } from "@nestjs/common";
import { Department } from "./department.entity";
import { Memorandum } from "./memorandum.entity";
import { Employees } from "../employees/employees.entity";
import { Task } from "./task.entity";

@Entity("admin")
export class AdminEntity {

   
    @PrimaryGeneratedColumn('uuid')
    adminId: string ;
  
    // @Column({ type: 'varchar', length: 100, unique: true })
    // email: string;

    // @Column({ type: 'varchar' })
    // password: string;

    // @Column({ name: 'fullName', type: 'varchar', length: 150 })
    // name: string;

    // @Column({ type: 'varchar', length: 10, unique: true })
    // nidNumber: string;

 // @Column({ nullable: true })
    // nidImagePath: string;

     
    @Column({unique:true})
    Email: string;



    @Column({default:true,type:'boolean'})
    isActive: boolean;


    @Column({length:100,nullable:true})
    fullName: string;
   
    @Column({unsigned:true,type:'bigint',unique:true})
    phone:bigint


    @Column({select:false})
      password: string;


     @CreateDateColumn()
     createdAt: Date;
    memorandums: any;
    assignedEmployeeTasks: any;

    @BeforeInsert()
    async validatePhone(){
         try {
            this.phone && this.phone > 0;
         }
         catch (error) {
            throw new BadRequestException('invalid phone number');
         }

         if(this.password){
            const salt=await bcrypt.genSalt();
            this.password=await bcrypt.hash(this.password,salt);
         }
    }

    @OneToMany(() => Department,department=> department.admin)
    departments: Department[];
    

    // admin.entity.ts (add these to your existing AdminEntity)
 // admin.entity.ts (add these to your existing AdminEntity)
 // admin.entity.ts (add this to your existing AdminEntity)
@OneToMany(() => Memorandum, memorandum => memorandum.admin)
memorandum: Memorandum[];


@OneToMany(() => Task, task => task.assignedBy)
assignedTasks: Task[];




}