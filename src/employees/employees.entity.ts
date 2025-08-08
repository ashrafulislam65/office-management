import { Entity, PrimaryGeneratedColumn, Column, Index, UpdateDateColumn, CreateDateColumn } from 'typeorm';
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
    password: string;

    @Column()
    gender: string;

    @Column()
    phoneNumber: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true})
    salary: number;

    @Column({nullable: true, default: 'General'})
    department: string;
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}