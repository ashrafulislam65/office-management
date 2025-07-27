import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity("admin")
export class AdminEntity {
    @PrimaryGeneratedColumn('uuid')
    adminId: string;
  
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ name: 'fullName', type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 10, unique: true })
    nidNumber: string;

    @Column({ nullable: true })
    nidImagePath: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}