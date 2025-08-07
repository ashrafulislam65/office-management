import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class Employees {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ length: 100 })
    fullName: string;

    @Column({ unsigned: true })
    age: number;

    @Column({ 
        type: 'varchar',
        length: 10,
        default: 'active'
    })
    status: 'active' | 'inactive';

    @Column()
    @Index({ unique: true }) // This makes email unique and creates an index
    email: string;

    @Column()
    password: string;

    @Column()
    gender: string;

    @Column()
    phoneNumber: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    salary: number;

    @Column({nullable: true, default: 'General'})
    department: string;
}