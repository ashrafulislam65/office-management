//import { Body,Controller,Delete,Get,Param,ParseUUIDPipe,Patch,Post,Query } from"@nestjs/common";
import { Body, Controller, Post, Get, Param, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, BadRequestException, Patch, UseGuards, Delete, Query, Put } from "@nestjs/common";
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
    @Post()
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



 @Post(':adminId')
async createDepartment(
  @Param('adminId') adminId: string , // No UUID validation
  @Body() createDto: CreateDepartmentDto
) {
  return this.adminService.createDepartment(adminId, createDto);
}

 @Get(":adminId")
 async getAdminDepartments(
   @Param('adminId') adminId: string
 ): Promise<Department[]> {

    const departments=await this.adminService.getAdminDepartments(adminId);
    if(!departments || departments.length === 0) {
      throw new BadRequestException('No departments found for this admin');
    }
    return this.adminService.getAdminDepartments(adminId);
     }

     @Put(":adminId/:departmentId")
     @UsePipes(new ValidationPipe())
     async updateDepartment(
       @Param('adminId') adminId: string,
       @Param('departmentId') departmentId: string,
       @Body() updateDto: UpdateDepartmentDto
     ): Promise<Department> {
       return this.adminService.updateDepartment(adminId, departmentId, updateDto);
     }

    // c:\Users\MSI\Desktop\project_backend\office-management\src\admin\admin.controller.ts

@Delete(':adminId/:departmentId')
async deleteDepartment(
  @Param('adminId') adminId: string,
  @Param('departmentId') departmentId: string
): Promise<{ message: string }> {
  await this.adminService.deleteDepartment(adminId, departmentId);
  return { message: 'Department deleted successfully' };

}

@Get('departments')
async getDepartment(): Promise<Department[]> {
  return this.adminService.getDepartment();
}



}
     



