// src/admin/memorandum.entity.ts
import { Employees } from 'src/employees/employees.entity';
import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, ManyToOne } from 'typeorm';
 // Adjust the import path as necessary

@Entity('memorandum')
export class Memorandum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // Simple foreign key relationship
   
 @ManyToOne(() => Employees, employee => employee.memorandums)
  recipient: Employees;

//   @ManyToOne(() => AdminEntity)
//   admin: AdminEntity;
}