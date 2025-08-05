import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employees {
    @PrimaryGeneratedColumn({ unsigned: true })
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
}