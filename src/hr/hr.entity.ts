import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("employees")
export class EmployeeEntity{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    email: string;
}
