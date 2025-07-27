import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { HrService } from './hr.services';
import { CreateHrDto } from './dto/hr.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from 'multer';




@Controller('hr')
export class HrController{
    constructor(private readonly hrService: HrService){}

    @Get()
    getHr(){
        return this.hrService.getDashboardData();
    }


    @Get('/:id')
    getHrId(@Param('id')id: number): string {
        return this.hrService.getHrId(id);
    }


    @Post()
    createHr(@Body() createHrDto: CreateHrDto){
        return this.hrService.createHr(createHrDto);
    }


     @Post('upload')
        @UseInterceptors(
            FileInterceptor('file', {
            storage: diskStorage({
                destination: './hr/uploads', // ✅ make sure this folder exists
                filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
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





    
}

