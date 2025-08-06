import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employees } from '../employees/employees.entity';
import { HrEntity } from './hr.entity';

@Entity('hr_task')
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskTitle: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'date' })
    assignedDate: Date;

    @Column({ type: 'date' })
    dueDate: Date;

    @ManyToOne(() => Employees, (employee) => employee.id, { eager: true })
    employee: Employees; 

    @ManyToOne(() => HrEntity, (hr) => hr.id, { eager: true })
    assignedBy: HrEntity; 

    @Column({nullable:true})
    empFullName: string;

    @Column({nullable:true})
    hrFullName: string;

    @Column({ default: 'pending' })
    status: string;
}
