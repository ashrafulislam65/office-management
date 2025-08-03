import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity("hr")
export class HrEntity {
    @PrimaryColumn()
    id: string;

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
    designation: string;

    @Column()
    salary: string;

    @Column({ default: false })
    isWorking: boolean;

    @BeforeInsert()
    generateId() {
        this.id = uuid();  
    }
}
