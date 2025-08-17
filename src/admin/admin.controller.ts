//import { Body,Controller,Delete,Get,Param,ParseUUIDPipe,Patch,Post,Query } from"@nestjs/common";
import { Body, Controller, Post, Get, Param, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, BadRequestException, Patch, UseGuards, Delete, Query, Put, ParseUUIDPipe, ParseIntPipe, Req, UnauthorizedException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AdminService } from './admin.service';
import { CreateUserDto } from './admin.dto';
import { AdminEntity } from './admin.entity';
//import { UpdateUserDto } from './update-user.dto';
import { UpdateAdminDto } from "./update-admin.dto";    
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDepartmentDto,UpdateDepartmentDto } from "./department.dto";
import { Department } from "./department.entity";
import { CreateMemorandumDto, UpdateMemorandumDto } from "./memorandum.dto";
import { Memorandum } from "./memorandum.entity";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import { CreateHrDto, UpdateHrDto } from "../hr/hr.dto";
import { HrEntity } from "../hr/hr.entity";
import { Employees } from "../employees/employees.entity";
import { CreateEmployeeTaskDto, SubmitEmployeeTaskDto, UpdateEmployeeTaskDto } from "./employee-task.dto";
import { EmployeeTask } from "./employee-task.entity";
import { SessionGuard } from "./session.guard";
import { LoginDto } from "./login.dto";
@Controller('admin/users')
export class AdminController {
    
  constructor(private readonly adminService:AdminService) {}

  // 
//   @Post('register')
//     @UseInterceptors(FileInterceptor('nidImage', {
//         storage: diskStorage({
//             destination: './uploads/nid',
//             filename: (req, file, cb) => {
//                 cb(null, `${Date.now()}-${file.originalname}`);
//             }
//         }),
//         fileFilter: (req, file, cb) => {
//             if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
//                 cb(null, true);
//             } else {
//                 cb(new Error('Only image (jpg, jpeg, png) and PDF files are allowed'), false);
//             }
//         },
//         limits: { fileSize: 2 * 1024 * 1024 } // 2MB
//     }))
//     @UsePipes(new ValidationPipe())
//     async registerAdmin(
//         @Body() adminData: CreateUserDto,
//         @UploadedFile() nidImage: Express.Multer.File
//     ): Promise<AdminEntity> {
//         if (!nidImage) {
//             throw new BadRequestException('NID image is required');
//         }

//         return this.adminService.createAdmin(adminData, nidImage.path);
//     }

//     @Get('nid-image/:filename')
//     async getNidImage(@Param('filename') filename: string, @Res() res) {
//         res.sendFile(filename, { root: './uploads/nid' });
//     }

//     @Get(':email')
//     async getAdminByEmail(@Param('email') email: string): Promise<AdminEntity> {
//         const admin = await this.adminService.findByEmail(email);
//         if (!admin) {
//             throw new BadRequestException('Admin not found');
//         }
//         return admin;
//     }

//     @Patch('by-email/:email')
// @UsePipes(new ValidationPipe())
// async updateAdminByEmail(
//   @Param('email') email: string,
//   @Body() updateData: UpdateAdminDto
// ): Promise<AdminEntity> {
//   return this.adminService.updateAdminByEmail(email, updateData);
// }

// @Get()

// async getAllAdmins(): Promise<AdminEntity[]> {
//   return this.adminService.getAllAdmins();
// }   

     // ...existing code...
     //admin profile 
    @Post('register')
    @UsePipes(new ValidationPipe())
    async createAdmin(
    @Body() adminData: CreateUserDto
     ): Promise<AdminEntity> {
    return this.adminService.createAdmin(adminData);
      }

     @Patch(':phone')
    async updatePhone(
        @Param('id') id:string,
        @Body('phone')phone :bigint
    ):Promise<AdminEntity>{
        return this.adminService.updatePhone(id,phone);
    }

    
@Get('fullName')
async getAdminwithFullName(@Query('fullName') fullName: string): Promise<AdminEntity[]> {
  return this.adminService.getAdminwithFullName(fullName);
}



    @Delete(':id')
    async deleteAdmin(@Param('id') id:string):Promise<void>{
        return this.adminService.deleteAdmin(id);   
    }

    @Get()
    async getAllAdmins(): Promise<AdminEntity[]> {
        return this.adminService.getAllAdmins();
    }


    @Get('null-fullName')
    async getAdminWithNullFullName(): Promise<AdminEntity[]> {
        return this.adminService.getAdminWithNullFullName();
    }


    // @Post('department')
    // @UsePipes(new ValidationPipe())
    // createDepartment(
    //     @Body() departmentDto: Department
    // ): Promise<Department> {
    //     return this.adminService.createDepartment(departmentDto);
    // }

    // @Get('department')
    // async getAllDepartments(): Promise<Department[]> {
    //     return this.adminService.getAllDepartments();
    // }

    // @Patch('department/:id')
    // async updateDepartment(
    //     @Param('id') id: number,
    //     @Body() departmentDto: DepartmentDto
    // ): Promise<Department> {
    //     return this.adminService.updateDepartment(id, departmentDto);
    // }

    // @Delete('department/:id')
    // async deleteDepartment(@Param('id') id: number): Promise<void> {
    //     return this.adminService.deleteDepartment(id);
    // }

//department 

 @Post('departments/:adminId')
 @UseGuards(SessionGuard)
async createDepartment(
  @Param('adminId', ParseUUIDPipe) adminId: string ,
  @Body() createDto: CreateDepartmentDto
) {
  return this.adminService.createDepartment(adminId, createDto);
}

 @Get("departments/:adminId")
 @UseGuards(SessionGuard)
 async getAdminDepartments(
   @Param('adminId') adminId: string
 ): Promise<Department[]> {

    const departments=await this.adminService.getAdminDepartments(adminId);
    if(!departments || departments.length === 0) {
      throw new BadRequestException('No departments found for this admin');
    }
    return this.adminService.getAdminDepartments(adminId);
     }

    //  @Put(":adminId/:departmentId")
    //  @UsePipes(new ValidationPipe())
    //  async updateDepartment(
    //    @Param('adminId') adminId: string,
    //    @Param('departmentId') departmentId: string,
    //    @Body() updateDto: UpdateDepartmentDto
    //  ): Promise<Department> {
    //    return this.adminService.updateDepartment(adminId, departmentId, updateDto);
    //  }

    // c:\Users\MSI\Desktop\project_backend\office-management\src\admin\admin.controller.ts


    @Put(':adminId/:employeeId')
    @UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async updateDepartmentByEmployee(
  @Param('adminId') adminId: string,
  @Param('employeeId', ParseIntPipe) employeeId: number,
  @Body() updateDto: UpdateDepartmentDto
): Promise<Department> {
  return this.adminService.updateDepartmentByEmployee(adminId, employeeId, updateDto);
}


@Delete(':adminId/:departmentId')
@UseGuards(SessionGuard)
async deleteDepartment(
  @Param('adminId') adminId: string,
  @Param('departmentId') departmentId: string
): Promise<{ message: string }> {
  await this.adminService.deleteDepartment(adminId, departmentId);
  return { message: 'Department deleted successfully' };

}

@Get('departments')
@UseGuards(SessionGuard)
  async getAllDepartments(): Promise<Department[]> {
    return this.adminService.getAllDepartments();
  }

// Create memorandum

   @Post(':adminId/memorandums')
   @UseGuards(SessionGuard)
   @UsePipes(new ValidationPipe())
async createMemorandum(
  @Param('adminId') adminId: string,
  @Body() createDto: CreateMemorandumDto
): Promise<Memorandum> {
  return this.adminService.createMemorandum(adminId, createDto);
}


@Get(':adminId/memorandums')
@UseGuards(SessionGuard)
async getAllMemorandums():Promise<Memorandum[]> {
  return this.adminService.getAllMemorandums();


}

@Get(':adminId/memorandums')
@UseGuards(SessionGuard)
async getAdminMemorandums(
  @Param('adminId') adminId: string
): Promise<Memorandum[]> {
  return this.adminService.getAdminMemorandums(adminId);
}

@Patch(':adminId/memorandums/:id')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async updateMemorandum(
  @Param('adminId') adminId: string,
  @Param('id') id: string,
  @Body() updateDto: UpdateMemorandumDto
) {
  return this.adminService.updateMemorandum(adminId, id, updateDto);
}


@Delete(':adminId/memorandums/:id')
@UseGuards(SessionGuard)
async deleteMemorandum(
  @Param('adminId') adminId: string,
  @Param('id') id: string
) {
  return this.adminService.deleteMemorandum(adminId, id);
}

// Create Task for hr
@Post(':adminId/tasks')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async createTask(
  @Param('adminId') adminId: string,
  @Body() createDto: CreateTaskDto
) {
  return this.adminService.createTask(adminId, createDto);
}

@Get(':adminId/tasks')
@UseGuards(SessionGuard)
async getAdminTasks(
  @Param('adminId') adminId: string
) {
  return this.adminService.getAdminTasks(adminId);
}

// @Patch('tasks/:taskId/status')
// @UsePipes(new ValidationPipe())
// async updateTaskStatus(
//   @Param('taskId') taskId: string,
//   @Body() updateDto: UpdateTaskDto
// ) {
//   return this.adminService.updateTaskStatus(taskId, updateDto);
// }

@Patch('tasks/:taskId')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async updateTask(
  @Param('taskId') taskId: string,
  @Body() updateDto: UpdateTaskDto
) {
  return this.adminService.updateTask(taskId, updateDto);
}

// add hr 

@Post('hr-management')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async createHr(
  @Body() createDto: CreateHrDto
): Promise<HrEntity> {
  return this.adminService.createHr(createDto);
}

@Get('hr-management')
@UseGuards(SessionGuard)
async getAllHr(): Promise<HrEntity[]> {
  return this.adminService.getAllHr();
}

@Get('hr-management/:id')
@UseGuards(SessionGuard)
async getHrById(@Param('id') id: number): Promise<HrEntity> {
  return this.adminService.getHrById(id);


}

@Patch('hr-management/:id')
@UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async updateHr(
    @Param('id') id: number,
    @Body() updateDto: UpdateHrDto
  ): Promise<HrEntity> {
    return this.adminService.updateHr(id, updateDto);
  }

   
// get all employee

  @Get('employees')
  @UseGuards(SessionGuard)
  async getAllEmployees(): Promise<Employees[]> {
    return this.adminService.getAllEmployees();
  }

  // employee task 
  @Post(':adminId/employee-tasks')
  @UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async createEmployeeTask(
  @Param('adminId') adminId: string,
  @Body() createDto: CreateEmployeeTaskDto
): Promise<EmployeeTask> {
  return this.adminService.createEmployeeTask(adminId, createDto);
}

@Get(':adminId/employee-tasks')
@UseGuards(SessionGuard)
async getAdminEmployeeTasks(
  @Param('adminId') adminId: string
): Promise<EmployeeTask[]> {
  return this.adminService.getAdminEmployeeTasks(adminId);
}

@Get('employee-tasks/:employeeId')
@UseGuards(SessionGuard)
async getEmployeeTasks(
  @Param('employeeId', ParseIntPipe) employeeId: number
): Promise<EmployeeTask[]> {
  return this.adminService.getEmployeeTasks(employeeId);
}

@Patch('employee-tasks/submit/:taskId')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async submitEmployeeTask(
  @Param('taskId') taskId: string,
  @Body() submitDto: SubmitEmployeeTaskDto
): Promise<EmployeeTask> {
  return this.adminService.submitEmployeeTask(taskId, submitDto);
}

@Patch('employee-tasks/:taskId')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async updateEmployeeTask(
  @Param('taskId') taskId: string,
  @Body() updateDto: UpdateEmployeeTaskDto
): Promise<EmployeeTask> {
  return this.adminService.updateEmployeeTask(taskId, updateDto);
}

//send email
 @Post('send')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ) {
    await this.adminService.sendEmail(to, subject, text);
    return { message: 'Email sent successfully!' };
  }



  // session login 

//  @Post('login')
// @UsePipes(new ValidationPipe())
// async login(
//   @Body() body: { Email: string, password: string }, // Change here
//   @Req() req: Request
// ) {
//   if (!body.Email || !body.password) { // Change here
//     throw new BadRequestException('Email and password are required');
//   }
//   return this.adminService.login(body.Email, body.password, req); // Change here
// }

//  @Post('login')
// @UsePipes(new ValidationPipe())
// async login(
//   @Body() body: { email: string, password: string },
//   @Req() req: Request
// ) {
//   if (!body.email || !body.password) {
//     throw new BadRequestException('Email and password are required');
//   }
  
//   // Debug log
//   console.log(`Login attempt for: ${body.email}`);
  
//   return this.adminService.login(body.email, body.password, req);
// }

@Post('login')
@UsePipes(new ValidationPipe())
async login(
  @Body() loginDto: LoginDto,
  @Req() req: Request
) {
  return this.adminService.login(loginDto.email, loginDto.password, req);
}

  @Post('logout')
  async logout(@Req() req: Request) {
    const success = await this.adminService.logout(req);
    if (!success) {
      throw new BadRequestException('Logout failed');
    }
    return { message: 'Logged out successfully' };
  }

  @Get('session')
  async getSession(@Req() req: Request) {
    const user = this.adminService.getSessionUser(req);
    if (!user) {
      throw new UnauthorizedException('No active session');
    }
    return user;
  }
}

     



