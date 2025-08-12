// import{Entity,PrimaryGeneratedColumn,Column,ManyToOne,CreateDateColumn,UpdateDateColumn, Admin}from'typeorm';
// import{AdminEntity}from'./admin.entity';
// import { HrEntity } from 'src/hr/hr.entity';

// export enum TaskStatus {
//     PENDING = 'Pending',
//     SUBMITTED = 'Submitted',
// }

// @Entity('task')
// export class Task{
//     @PrimaryGeneratedColumn('uuid')
//     id:string;

//     @Column()
//     title:string;

//     @Column('text')
//     description:string;


//     @CreateDateColumn()
//     assignDate:Date;


//     @Column()
//      dueDate:Date;

//      @Column({nullable:true})
//      submissionUrl:string | null;

//      @Column({
//         type: 'enum',
//         enum: TaskStatus,
//         default: TaskStatus.PENDING
//      })
//      status:TaskStatus;

//      @ManyToOne(()=> AdminEntity,admin=>admin.assignedTasks)
//      assignedBy:AdminEntity;

//      @ManyToOne(() => HrEntity, hr => hr.tasks)
//   assignedTo: HrEntity;

//   @UpdateDateColumn()
//   updatedAt: Date;


// }

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { HrEntity } from 'src/hr/hr.entity';

export enum TaskStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted'
}

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  assignDate: Date;

  @Column()
  dueDate: Date;

  @Column({ type: 'varchar', nullable: true }) // Explicitly set type and nullable
  submissionUrl: string | null;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @ManyToOne(() => AdminEntity, admin => admin.assignedTasks)
  assignedBy: AdminEntity;

  @ManyToOne(() => HrEntity, hr => hr.tasks, { nullable: true, onDelete: 'SET NULL' })
  assignedTo: HrEntity;

  @UpdateDateColumn()
  updatedAt: Date;
}