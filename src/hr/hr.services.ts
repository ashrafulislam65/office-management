import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateHrDto } from './dto/hr.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { HrEntity } from "./hr.entity";


@Injectable()
export class HrService{

    constructor(
        @InjectRepository(HrEntity)
        private readonly hrRepository: Repository<HrEntity>,
    ){}
    getDashboardData():string{
        return 'Dashboard data for HR.'
    }

    getHrId(id: number): string {
        return `Admin ID: ${id}`
    }
    

    //Create new Hr
    async createHr(createHrDto: CreateHrDto): Promise<HrEntity>{
        const newHr = this.hrRepository.create(createHrDto);
        return await this.hrRepository.save(newHr);
    }

    // Retrieve Hr whose full name contains a substring
    async findHrByFullName(substring: string): Promise<HrEntity[]> {
        return await this.hrRepository.find({
        where: { 
            fullName: ILike(`%${substring}%`) 
        },
        });
    }

    // Retrieve a Hr by unique username
    async findHrByUsername(username: string): Promise<HrEntity> {
        const user = await this.hrRepository.findOne({ 
            where: { 
                username 
            } });
        if (!user) {
        throw new NotFoundException(`User with username "${username}" not found`);
        }
        return user;
    }

    // Remove a Hr by username
    async removeHrByUsername(username: string): Promise<void> {
        const result = await this.hrRepository.delete({ 
            username 
        });
        if (result.affected === 0) {
        throw new NotFoundException(`User with username "${username}" not found`);
        }
    }

    // Update a Hr by username
    async updateHrByUsername(username: string, updateData: Partial<CreateHrDto>): Promise<HrEntity> {
        const hr = await this.hrRepository.findOne({ where: { username } });

        if (!hr) {
            throw new NotFoundException(`User with username "${username}" not found`);
        }

        Object.assign(hr, updateData);

        return await this.hrRepository.save(hr);
    }


    //Create Employee
    async createEmployee() Promise<>{

    }

}