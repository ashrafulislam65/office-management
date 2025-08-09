// src/admin/memorandum.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';

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
   


  @ManyToOne(() => AdminEntity)
  admin: AdminEntity;
}