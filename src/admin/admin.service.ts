import { BadRequestException, Injectable,NotFoundException, UnauthorizedException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from "./admin.entity";
//import{User} from "./user.interface";
import { CreateUserDto } from "./admin.dto";
//import { UpdateAdminDto } from "./update-user.dto";
import{ UpdateAdminDto } from "./update-admin.dto";

import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from "class-validator";

@Injectable()
export class AdminService {
    // deleteAdmin(id: string): void | PromiseLike<void> {
    //     throw new Error("Method not implemented.");
    // }

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

//     async createAdmin(adminData: CreateUserDto, nidImagePath: string): Promise<AdminEntity> {
        
//         const existingAdmin = await this.adminRepo.findOne({
//             where: [
//                 { email: adminData.email },
//                 { nidNumber: adminData.nidNumber }
//             ]
//         });

//         if (existingAdmin) {
//             if (existingAdmin.email === adminData.email) {
//                 throw new UnauthorizedException('Email already exists');
//             } else {
//                 throw new UnauthorizedException('NID number already exists');
//             }
//         }

//         const newAdmin = new AdminEntity();
//         Object.assign(newAdmin, adminData);
//         newAdmin.nidImagePath = nidImagePath;

//         return await this.adminRepo.save(newAdmin);
    
//     }

//     async findByEmail(email: string): Promise<AdminEntity> {
//         const admin = await this.adminRepo.findOneBy({ email });
//         if (!admin) {
//             throw new NotFoundException(` email ${email} not found`);
//         }
//         return admin;
//     }
//     async validateAdmin(email: string, password: string): Promise<AdminEntity | null> {
//         const admin = await this.findByEmail(email);
//         if (admin && await bcrypt.compare(password, admin.password)) {
//             return admin;
//         }
//         return null;
//     }

//     async updateAdminByEmail(email: string, updateData: UpdateAdminDto): Promise<AdminEntity> {
//   const admin = await this.adminRepo.findOneBy({ email });
//   if (!admin) throw new NotFoundException('Admin not found');

//   if (updateData.password) {
//     updateData.password = await bcrypt.hash(updateData.password, 10);
//   }

//   Object.assign(admin, updateData);
//   return this.adminRepo.save(admin);
// }

// async getAllAdmins(): Promise<AdminEntity[]> {
//   return this.adminRepo.find({
//     select: [
//       'adminId',
//       'email',
//       'name',
//       'nidNumber',
//       'nidImagePath',
//       'createdAt'
//     ],
//     order: { createdAt: 'DESC' }
//   });
// }

//       async createAdmin(adminData: CreateUserDto): Promise<AdminEntity> {
         
//         const exixtingAdmin = await this.adminRepo.findOne({
//             where: { phone: adminData.phone }
//         });

//         if (exixtingAdmin) {
//             throw new UnauthorizedException('Phone number already exists');
//         }


        
//          const admin = this.adminRepo.create({
//                ...adminData,
//           isActive: adminData.isActive !== undefined ? adminData.isActive : true,
//          fullName: adminData.fullName ?? undefined, 
// });

//         return await this.adminRepo.save(admin);
//       }
       async createAdmin(adminData: CreateUserDto): Promise<AdminEntity> {
         
        const exixtingAdmin = await this.adminRepo.findOne({
            where: { phone: adminData.phone }
        });

        if (exixtingAdmin) {
            throw new UnauthorizedException('Phone number already exists');
        }


        
         const admin = this.adminRepo.create({
               ...adminData,
          isActive: adminData.isActive !== undefined ? adminData.isActive : true,
         fullName: adminData.fullName ?? undefined, 
});

        return await this.adminRepo.save(admin);
      }

      


      async updatePhone(id: string, phone: bigint): Promise<AdminEntity> {
        
        const existingAdmin = await this.adminRepo.findOne({
            where: { phone }
        });

        if (existingAdmin && existingAdmin.adminId !== id) {
            throw new UnauthorizedException("This phone number is already in use by another admin");
        }

        const admin = await this.adminRepo.findOne({
            where: { adminId: id }
        });

        if (!admin) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }

        admin.phone = phone;
        await this.adminRepo.save(admin);
        return admin;
      }
      
        async getAdminwithFullName(fullName: string): Promise<AdminEntity[]> {
          
            return this.adminRepo.find({
                where:{fullName:IsNull()},
                order: { createdAt: 'DESC' }
        
            });
        }

    //       async deleteAdmin(id: string): Promise<void> {
    //     const result = await this.adminRepo.delete(id);
    //     if (result.affected === 0) {
    //         throw new NotFoundException(`Admin with ID ${id} not found`);
    //     }
    // }

    async deleteAdmin(id: string): Promise<void> {
        
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid admin ID format (must be UUID)');
        }

        const result = await this.adminRepo.delete(id);
        
        if (result.affected === 0) {
            throw new NotFoundException(`Admin with ID ${id} not found`);
        }
    }

        async getAllAdmins(): Promise<AdminEntity[]> {
            return this.adminRepo.find({
                 order: { createdAt: 'DESC' },
        });
        

    }

    async getAdminWithNullFullName(): Promise<AdminEntity[]> {
        const admins = await this.adminRepo.find({
            where: { fullName: IsNull() },
            order: { createdAt: 'DESC' }
        });

        if (admins.length === 0) {
            throw new NotFoundException('No admins found with null fullName');
        }

        return admins;
    }
}
