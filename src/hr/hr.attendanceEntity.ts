import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Employees } from '../employees/employees.entity';

@Entity('emp_attendance')
export class AttendanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employees, (employee) => employee.id, { eager: true })
  employee: Employees;

  @Column({nullable:true})
  empFullName: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: 'present' })
  status: 'present' | 'absent' | 'late';

  @Column({ type: 'time', nullable: true })
  checkInTime: string;

  @Column({ type: 'time', nullable: true })
  checkOutTime: string;

  @CreateDateColumn()
  createdAt: Date;
}
