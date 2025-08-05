import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { BadRequestException } from "@nestjs/common";

@Entity("admin")
export class AdminEntity {
    @PrimaryGeneratedColumn('uuid')
    adminId: string;
  
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



    @Column({default:true,type:'varchar'})
    isActive: boolean;


    @Column({length:100,nullable:true})
    fullName: string;

    @Column({unsigned:true,type:'bigint',unique:true})
    phone:bigint

     @CreateDateColumn()
     createdAt: Date;

    @BeforeInsert()
    validatePhone(){
         try {
            this.phone && this.phone > 0;
         }
         catch (error) {
            throw new BadRequestException('invalid phone number');
         }
    }
    

}