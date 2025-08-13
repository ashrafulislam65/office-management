import { BadRequestException, Injectable,NotFoundException, UnauthorizedException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { In, IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from "./admin.entity";
//import{User} from "./user.interface";
import { CreateUserDto } from "./admin.dto";
//import { UpdateAdminDto } from "./update-user.dto";
import{ UpdateAdminDto } from "./update-admin.dto";
import { CreateDepartmentDto,UpdateDepartmentDto} from "./department.dto";
import { Department } from "./department.entity";
import { Employees } from "../employees/employees.entity";


import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from "class-validator";
import { CreateEmployeesDto } from "../employees/employees.dto";
import { CreateMemorandumDto, UpdateMemorandumDto } from "./memorandum.dto";
import { Memorandum } from "./memorandum.entity";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { Task } from "./task.entity";
import { HrEntity } from "../hr/hr.entity";
import { TaskStatus } from './task.entity'; // Add this import
import { CreateHrDto, UpdateHrDto } from "../hr/hr.dto";
import { EmployeeTask, EmployeeTaskStatus } from "./employee-task.entity";
import{CreateEmployeeTaskDto, SubmitEmployeeTaskDto, UpdateEmployeeTaskDto} from "./employee-task.dto";
import { EmailService } from "./email.service";

@Injectable()
export class AdminService {
    //memorandumRepo: any;
    
    constructor(
        @InjectRepository(AdminEntity)
        private adminRepo: Repository<AdminEntity>,
        @InjectRepository(Department)
        private departmentRepo: Repository<Department>,
        @InjectRepository(Employees)
        private employeeRepo: Repository<Employees>,
        @InjectRepository(Memorandum)
        private memorandumRepo: Repository<Memorandum>,
        @InjectRepository(Task)
        private taskRepo: Repository<Task>,
        @InjectRepository(HrEntity)
        private hrRepo: Repository<HrEntity>,
        @InjectRepository(EmployeeTask)
        private employeeTaskRepo: Repository<EmployeeTask>,
        private readonly emailService: EmailService
    ) {}

    

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



    // constructor replaced above

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

        const admin = this.adminRepo.create(adminData);
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
                where: { fullName },
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



    // async createDepartment(departmentDto: CreateDepartmentDto): Promise<Department> {
    //     const admin = await this.adminRepo.findOneBy({
    //         adminId: departmentDto.adminid
    //     });

    //     if(!admin) {
    //         throw new NotFoundException(`Admin with ID ${departmentDto.adminid} not found`);
    //     }

    //     // Verify employee exists
    //     const employeeExists = await this.departmentRepo.findOneBy({
    //         employeeId: parseInt(departmentDto.employeesid)
    //     });

    //     if(!employeeExists) {
    //         throw new NotFoundException(`Employee with ID ${departmentDto.employeeId} not found`);
    //     }

    //     // Create and save department with proper type handling
    //     const department = this.departmentRepo.create({
    //         ...departmentDto,
    //         admin: admin
    //     });

    //     return await this.departmentRepo.save(department);
    // }

    // department
    async createDepartment(adminId: string, createDto: CreateDepartmentDto): Promise<Department> {
        const admin = await this.adminRepo.findOne({ where: {adminId } });
        if (!admin) {
            throw new NotFoundException(`Admin with ID ${adminId} not found`);
        }

        const employee = await this.employeeRepo.findOne({
            where: { id: createDto.employeeId },
        });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${createDto.employeeId} not found`);
        }

        const department = this.departmentRepo.create({
            departmentType: createDto.departmentType,
            role: createDto.role,
            admin: admin,
            employee: employee,
            joiningDate: createDto.joiningDate || new Date(),
            isActive: createDto.isActive !== undefined ? createDto.isActive : true,
        });

        return this.departmentRepo.save(department);
    }

// async getDepartment(): Promise<Department[]> {
//   return this.departmentRepo.find();
// }

 async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepo.find({
      relations: ['admin', 'employee'] // Include related entities
    });
  }

 async getAdminDepartments(adminId: string): Promise<Department[]> {
    return this.departmentRepo.find({
        where:{admin:{adminId}},
        relations: ['admin', 'employee'],
    });

}

async getDepartmentById(id: string, departmentId: string): Promise<Department | null> {
    return this.departmentRepo.findOne({
        where: { admin: { adminId: id }, id: departmentId },
        relations: ['admin', 'employee'],
    });
}

async updateDepartment(
  adminId: string,
  departmentId: string,
  updateDto: UpdateDepartmentDto
): Promise<Department> {
  const department = await this.departmentRepo.findOne({
    where: { id: departmentId, admin: { adminId } }
  });
  
  if (!department) {
    throw new NotFoundException('Department not found');
  }

  // Update employee reference if needed
  if (updateDto.employeeId) {
    const employee = await this.employeeRepo.findOne({
      where: { id: updateDto.employeeId }
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${updateDto.employeeId} not found`);
    }
    department.employee = employee;
  }

  // Update other fields
  if (updateDto.departmentType) {
    department.departmentType = updateDto.departmentType;
  }
  if (updateDto.role) {
    department.role = updateDto.role;
  }
  if (updateDto.joiningDate) {
    department.joiningDate = updateDto.joiningDate;
  }
  if (updateDto.isActive !== undefined) {
    department.isActive = updateDto.isActive;
  }

  return this.departmentRepo.save(department);
}


//   async getDepartmentById(id:number): Promise<Department> {
//     const department = await this.departmentRepo.findOneBy({ id });
//     if (!department) {
//         throw new NotFoundException(`Department with ID ${id} not found`);
//     }
//     return department;
// }

//     async updateDepartment(id: number, departmentDto: DepartmentDto): Promise<Department> {
//         const department = await this.getDepartmentById(id);
    
//         // Update fields
//         department.employeeId = parseInt(departmentDto.employeeId);
//         department.department = departmentDto.department;
//         department.role = departmentDto.role;
    
//         return this.departmentRepo.save(department);
//     }
    
      async deleteDepartment(adminId: string, departmentId: string): Promise<void> {
    const result = await this.departmentRepo.delete({
      id: departmentId,
      admin: { adminId }
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Department not found or not owned by admin`);
    }
  }

    // async createMemorandum(adminId:string,createDto:CreateMemorandumDto): Promise<Memorandum> {
    //     const admin = await this.adminRepo.findOne({
    //         where: { adminId }
    //     });

    //     if (!admin) {
    //         throw new NotFoundException(`Admin with ID ${adminId} not found`);
    //     }

    //     const memorandum = this.memorandumRepo.create({
    //         ...createDto,
    //            admin,
             
    //     });

    //     return this.memorandumRepo.save(memorandum);
  

    // }

    // Create memorandum
    async createMemorandum(adminId: string, createDto: CreateMemorandumDto) {
    // Verify admin exists
    const admin = await this.adminRepo.findOne({ 
      where: { adminId } 
    });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

     
    const memorandum = this.memorandumRepo.create({
      ...createDto,
      
    });
    
    return this.memorandumRepo.save(memorandum);
  }
   
    async getAllMemorandums(): Promise<Memorandum[]> {
        return this.memorandumRepo.find({
            relations: ['admin'],
            order: { createdAt: 'DESC' }
        });
    }

   async getAdminMemorandums(adminId: string): Promise<Memorandum[]> {
        return this.memorandumRepo.find({
            where: { admin: { adminId } },
            order: { createdAt: 'DESC' },
   });

}
     async updateMemorandum(
  adminId: string,
  memorandumId: string,
  updateDto: UpdateMemorandumDto
): Promise<Memorandum> {
  const memorandum = await this.memorandumRepo.findOne({
    where: { id: memorandumId, admin: { adminId } },
  });

  if (!memorandum) {
    throw new NotFoundException('Memorandum not found or you are not the owner');
  }

  if (updateDto.title) {
    memorandum.title = updateDto.title;
  }
  if (updateDto.content) {
    memorandum.content = updateDto.content;
  }

  return this.memorandumRepo.save(memorandum);
}

async deleteMemorandum(adminId: string, memorandumId: string): Promise<void> {
  const result = await this.memorandumRepo.delete({
    id: memorandumId,
    admin: { adminId },
  });

  if (result.affected === 0) {
    throw new NotFoundException('Memorandum not found or you are not the owner');
  }


}

  // task assign to hr 
//    async createTask(adminId: string, createDto: CreateTaskDto): Promise<Task> {
//   const admin = await this.adminRepo.findOne({ where: { adminId } });
//   if (!admin) throw new NotFoundException('Admin not found');

//   const hr = await this.hrRepo.findOne({ where: { id: createDto.hrId } });
//   if (!hr) throw new NotFoundException('HR not found');

//   const task = this.taskRepo.create({
//     title: createDto.title,
//     description: createDto.description,
//     dueDate: new Date(createDto.dueDate),
//     assignedBy: admin,
//     submissionUrl: createDto.submissionUrl || null,
//     status: TaskStatus.PENDING,
//     assignedTo: hr
//   });

//   return this.taskRepo.save(task);
// }

// admin.service.ts
// async createTask(adminId: string, createDto: CreateTaskDto): Promise<Task> {
//   const admin = await this.adminRepo.findOne({ where: { adminId } });
//   if (!admin) throw new NotFoundException('Admin not found');

//   const hr = await this.hrRepo.findOne({ where: { id: createDto.hrId } });
//   if (!hr) throw new NotFoundException('HR not found');

//   const task = this.taskRepo.create({
//     title: createDto.title,
//     description: createDto.description,
//     dueDate: new Date(createDto.dueDate),
//     status: TaskStatus.PENDING,
//     submissionUrl: createDto.submissionUrl || null, // Use provided URL or null
//     assignedBy: admin,
//     assignedTo: hr
//   });

//   return this.taskRepo.save(task);
// }

//hr task assign to hr

async createTask(adminId: string, createDto: CreateTaskDto): Promise<Task> {
  const admin = await this.adminRepo.findOne({ where: { adminId } });
  if (!admin) throw new NotFoundException('Admin not found');

  const hr = await this.hrRepo.findOne({ where: { id: createDto.hrId } });
  if (!hr) throw new NotFoundException('HR not found');

  const task = new Task();
  task.title = createDto.title;
  task.description = createDto.description;
  task.dueDate = new Date(createDto.dueDate);
  task.status = TaskStatus.PENDING;
  task.submissionUrl = createDto.submissionUrl || null;
  task.assignedBy = admin;
  task.assignedTo = hr;

  return this.taskRepo.save(task);
}

async getAdminTasks(adminId: string): Promise<Task[]> {
  return this.taskRepo.find({
    where: { assignedBy: { adminId } },
    relations: ['assignedTo'],
    order: { assignDate: 'DESC' }
  });
}

// async updateTaskStatus(
//   taskId: string,
//   updateDto: UpdateTaskDto
// ): Promise<Task> {
//   const task = await this.taskRepo.findOne({ where: { id: taskId } });
//   if (!task) throw new NotFoundException('Task not found');

//   if (updateDto.status) task.status = updateDto.status;
//   if (updateDto.submissionUrl) task.submissionUrl = updateDto.submissionUrl;
  
//   return this.taskRepo.save(task);
// }

async updateTask(
  taskId: string,
  updateDto: UpdateTaskDto
): Promise<Task> {
  const task = await this.taskRepo.findOne({ where: { id: taskId } });
  if (!task) throw new NotFoundException('Task not found');

  // Simply update with the provided string
  if (updateDto.submissionUrl !== undefined) {
    task.submissionUrl = updateDto.submissionUrl;
  }

  return this.taskRepo.save(task);
}



//add hr
async createHr(createDto:CreateHrDto):Promise<HrEntity> {

  const hr=this.hrRepo.create({
    ...createDto,
    isWorking:createDto.isWorking?? false
  });
  return this.hrRepo.save(hr);


}

  async getAllHr(): Promise<HrEntity[]> {
    return this.hrRepo.find();
  }

  async getHrById(id:number):Promise<HrEntity>{
    const hr=await this.hrRepo.findOne({where:{id}});
    if(!hr){
      throw new NotFoundException(`Hr with id ${id} not found`);
    }
    return hr;

  }


  async updateHr(id:number,updateDto:UpdateHrDto):Promise<HrEntity>{
    const hr= await this.hrRepo.findOne({where:{id}});
    if(!hr){
      throw new NotFoundException(`Hr with id ${id} not found`);
    }
    Object.assign(hr,{...updateDto});
    return this.hrRepo.save(hr);

  }

  // admin.service.ts

// async deleteHrByEmail(email: string): Promise<void> {
  
//   const hr = await this.hrRepo.findOne({ where: { email } });
//   if (!hr) {
//     throw new NotFoundException(`HR with email ${email} not found`);
//   }

//   const result = await this.hrRepo.delete(hr.id);
//   if (result.affected === 0) {
//     throw new NotFoundException(`HR with email ${email} not found`);
//   }

// }



//get all employee
async getAllEmployees(): Promise<Employees[]> {
    return this.employeeRepo.find({
      select: ['id', 'fullName', 'email', 'status', 'gender','phoneNumber'],
      order: { fullName: 'ASC' }
    });
  }



  //assign task to employee


//    async createEmployeeTask(adminId: string, createDto: CreateEmployeeTaskDto): Promise<EmployeeTask> {
//   const admin = await this.adminRepo.findOne({ where: { adminId } });
//   if (!admin) throw new NotFoundException('Admin not found');

//   // const employee = await this.employeeRepo.findOne({ 
//   //   where: { id: createDto.employeeId } // Now matches number type
//   // });
  
//   const employee = await this.employeeRepo.findOne({
//     where: { id: createDto.employeeId },
//   });
//   if (!employee) throw new NotFoundException('Employee not found');
//   const task = this.employeeTaskRepo.create({
//     title: createDto.title,
//     description: createDto.description,
//     url: createDto.url || null, // Explicitly set to null if undefined
//     dueDate: new Date(createDto.dueDate),
//     assignedBy: admin,
//     assignedTo: employee,
//     status: EmployeeTaskStatus.PENDING
//   });

//   return await this.employeeTaskRepo.save(task); // Add await here
// }



async createEmployeeTask(adminId: string, createDto: CreateEmployeeTaskDto): Promise<EmployeeTask> {
  const admin = await this.adminRepo.findOne({ where: { adminId } });
  if (!admin) throw new NotFoundException('Admin not found');

  const employee = await this.employeeRepo.findOne({
    where: { id: createDto.employeeId },
  });
  if (!employee) throw new NotFoundException('Employee not found');

  const task = this.employeeTaskRepo.create({
    title: createDto.title,
    description: createDto.description,
    url: createDto.url || null, // Explicitly set to null if undefined
    dueDate: new Date(createDto.dueDate),
    assignedBy: admin,
    assignedTo: employee,
    status: EmployeeTaskStatus.PENDING
  });

  return await this.employeeTaskRepo.save(task);

}



async getAdminEmployeeTasks(adminId: string): Promise<EmployeeTask[]> {
  return this.employeeTaskRepo.find({
    where: { assignedBy: { adminId } },
    relations: ['assignedTo'],
    order: { assignedAt: 'DESC' }
  });
}

async getEmployeeTasks(employeeId: number): Promise<EmployeeTask[]> {
  return this.employeeTaskRepo.find({
    where: { assignedTo: { id: employeeId } },
    relations: ['assignedBy'],
    order: { dueDate: 'ASC' }
  });
}

async submitEmployeeTask(taskId: string, submitDto: SubmitEmployeeTaskDto): Promise<EmployeeTask> {
  const task = await this.employeeTaskRepo.findOne({ where: { id: taskId } });
  if (!task) throw new NotFoundException('Task not found');

  task.submissionUrl = submitDto.submissionUrl;
  task.status = EmployeeTaskStatus.SUBMITTED;
  task.submittedAt = new Date();

  return this.employeeTaskRepo.save(task);
}

async updateEmployeeTask(taskId: string, updateDto: UpdateEmployeeTaskDto): Promise<EmployeeTask> {
  const task = await this.employeeTaskRepo.findOne({ where: { id: taskId } });
  if (!task) throw new NotFoundException('Task not found');

  if (updateDto.submissionUrl) {
    task.submissionUrl = updateDto.submissionUrl;
  }
  if (updateDto.status) {
    task.status = updateDto.status;
    if (updateDto.status === EmployeeTaskStatus.SUBMITTED && !task.submittedAt) {
      task.submittedAt = new Date();
    }
  }

  return this.employeeTaskRepo.save(task);
}


// send email 
async sendEmail(to: string, subject: string, text: string) {
  try {
    console.log('Attempting to send email to:', to);
    await this.emailService.sendEmail(to, subject, text);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed with details:', {
      error: error.message,
      stack: error.stack,
      response: error.response // For SMTP errors
    });
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

}
