import { Injectable,NotFoundException, UnauthorizedException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from "./admin.entity";
//import{User} from "./user.interface";
import { CreateUserDto } from "./admin.dto";
//import { UpdateUserDto } from "./update-user.dto";


import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {

// private users:User[] = [];

//  createUser(createUserDto: CreateUserDto): User {
//   const newUser: User = {
//     id: uuidv4(),  
//     ...createUserDto,
//     createdAt: new Date(),
//   };
//   this.users.push(newUser);
//   return newUser;
// }

// getAllUsers(): User[] {
//     return this.users;}


//     getUserById(id: string): User {
//         const user=this.users.find(u=> u.id === id);
//         if(!user){
//             throw new NotFoundException(`User with id ${id} not found`);
//         }
//         return user;
//     }


    // updateUser(id: string, updateUserDto: UpdateUserDto): User {
    //     const userIndex = this.users.findIndex(u => u.id === id);
    //     if (userIndex === -1) {
    //         throw new NotFoundException(`User with id ${id} not found`);
    //     }
    //     const updatedUser = { ...this.users[userIndex], ...updateUserDto };
    //     this.users[userIndex] = updatedUser;
    //     return updatedUser;
    // }
    // deleteUser(id:string):User{
    //     const index=this.users.findIndex(u => u.id === id);
    //     if (index === -1) {
    //         throw new NotFoundException(`User with id ${id} not found`);
    //     }
    //     const[deleteUser] = this.users.splice(index, 1);
    //     return deleteUser;
    // }



    constructor(
        @InjectRepository(AdminEntity)
        private adminRepo: Repository<AdminEntity>
    ) {}

    async createAdmin(adminData: CreateUserDto, nidImagePath: string): Promise<AdminEntity> {
        // Check if email or NID already exists
        const existingAdmin = await this.adminRepo.findOne({
            where: [
                { email: adminData.email },
                { nidNumber: adminData.nidNumber }
            ]
        });

        if (existingAdmin) {
            if (existingAdmin.email === adminData.email) {
                throw new UnauthorizedException('Email already exists');
            } else {
                throw new UnauthorizedException('NID number already exists');
            }
        }

        const newAdmin = new AdminEntity();
        Object.assign(newAdmin, adminData);
        newAdmin.nidImagePath = nidImagePath;

        return await this.adminRepo.save(newAdmin);
    
    }

    async findByEmail(email: string): Promise<AdminEntity> {
        const admin = await this.adminRepo.findOneBy({ email });
        if (!admin) {
            throw new NotFoundException(` email ${email} not found`);
        }
        return admin;
    }
    async validateAdmin(email: string, password: string): Promise<AdminEntity | null> {
        const admin = await this.findByEmail(email);
        if (admin && await bcrypt.compare(password, admin.password)) {
            return admin;
        }
        return null;
    }
    }




  

