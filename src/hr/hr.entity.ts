import { Task } from "src/admin/task.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity("hr")
export class HrEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    username: string;

    @Column({ length: 150 })
    fullName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column()
    address: string;

    @Column()
    salary: string;

    @Column({ default: false })
    isWorking: boolean;

    @Column({nullable: true})
    age: string;

    @Column({nullable: true})
    gender: string;

    // @BeforeInsert()
    // generateId() {
    //     this.id = uuid();  
    // }


    @OneToMany(() => Task, task => task.assignedTo)
tasks: Task[];
}