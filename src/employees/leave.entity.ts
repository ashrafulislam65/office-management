import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Employees } from './employees.entity';

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum LeaveType {
  SICK = 'sick',
  VACATION = 'vacation',
  PERSONAL = 'personal',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  OTHER = 'other'
}

@Entity()
export class Leave {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @ManyToOne(() => Employees, employee => employee.leaves)
    @JoinColumn({ name: 'employeeId' })
    employee: Employees;

    @Column()
    employeeId: number;

    @Column({
        type: 'enum',
        enum: LeaveType,
        default: LeaveType.VACATION
    })
    type: LeaveType;

    @Column({
        type: 'enum',
        enum: LeaveStatus,
        default: LeaveStatus.PENDING
    })
    status: LeaveStatus;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    appliedAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Calculated property (not stored in database)
    get duration(): number {
        const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    }
}