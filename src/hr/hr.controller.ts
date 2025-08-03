import { Body, Controller, Delete, Get, Param, Post, Query, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { HrService } from './hr.services';
import { CreateHrDto } from './dto/hr.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { extname, join } from "path";
import { diskStorage } from 'multer';
import { Response } from 'express';





@Controller('hr')
export class HrController{
    constructor(private readonly hrService: HrService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async createHr(@Body() createHrDto: CreateHrDto){
        return await this.hrService.createHr(createHrDto);
    }

    @Get()
    getHr(){
        return this.hrService.getDashboardData();
    }

    // Retrieve users whose full name contains a substring (query param)
    @Get('search')
    async searchHrByFullName(@Query('name') name: string) {
        return await this.hrService.findHrByFullName(name);
    }


    @Get('id/:id')
    getHrId(@Param('id')id: number): string {
        return this.hrService.getHrId(id);
    }

    // Retrieve a user by username (param)
    @Get('username/:username')
    async getHrByUsername(@Param('username') username: string) {
        return await this.hrService.findHrByUsername(username);
    }

    // Remove a user by username
    @Delete('username/:username')
    async deleteHrByUsername(@Param('username') username: string) {
        await this.hrService.removeHrByUsername(username);
        return { message: `User with username "${username}" has been removed` };
    }


    @Post('upload')
    @UseInterceptors(
            FileInterceptor('file', {
            storage: diskStorage({
                destination: './hr/uploads', 
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now();
                    const filename = `${file.originalname}`;
                    callback(null, filename);
                },
                

            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB max
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
            }),
        )
        uploadFile(@UploadedFile() file: Express.Multer.File): {
            message: string;
            filename: string;
            path: string;
        } {
            return {
            message: 'File uploaded successfully',
            filename: file.filename,
            path: `/hr/uploads/${file.filename}`,
            };
        }



    @Get('getimage/:name')
    getImage(@Param('name') name: string, @Res() res: Response) {
        const imagePath = join(process.cwd(), 'hr/uploads', name);
        return res.sendFile(imagePath);
    }





    
}

