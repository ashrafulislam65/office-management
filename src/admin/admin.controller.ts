//import { Body,Controller,Delete,Get,Param,ParseUUIDPipe,Patch,Post,Query } from"@nestjs/common";
import { Body, Controller, Post, Get, Param, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AdminService } from './admin.service';
import { CreateUserDto } from './admin.dto';
import { AdminEntity } from './admin.entity';
//import { UpdateUserDto } from './update-user.dto';

@Controller('admin/users')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 
  @Post('register')
    @UseInterceptors(FileInterceptor('nidImage', {
        storage: diskStorage({
            destination: './uploads/nid',
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                cb(null, true);
            } else {
                cb(new Error('Only image (jpg, jpeg, png) and PDF files are allowed'), false);
            }
        },
        limits: { fileSize: 2 * 1024 * 1024 } // 2MB
    }))
    @UsePipes(new ValidationPipe())
    async registerAdmin(
        @Body() adminData: CreateUserDto,
        @UploadedFile() nidImage: Express.Multer.File
    ): Promise<AdminEntity> {
        if (!nidImage) {
            throw new BadRequestException('NID image is required');
        }

        return this.adminService.createAdmin(adminData, nidImage.path);
    }

    @Get('nid-image/:filename')
    async getNidImage(@Param('filename') filename: string, @Res() res) {
        res.sendFile(filename, { root: './uploads/nid' });
    }

    @Get(':email')
    async getAdminByEmail(@Param('email') email: string): Promise<AdminEntity> {
        const admin = await this.adminService.findByEmail(email);
        if (!admin) {
            throw new BadRequestException('Admin not found');
        }
        return admin;
    }

  }

     



