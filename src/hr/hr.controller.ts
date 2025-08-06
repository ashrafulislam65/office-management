import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { HrService } from './hr.services';
import { CreateHrDto } from './dto/hr.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { extname, join } from "path";
import { diskStorage } from 'multer';
import { Response } from 'express';
import { HrEntity } from "./hr.entity";
import { Employees } from "src/employees/employees.entity";
import { CreateEmployeesDto } from "src/employees/employees.dto";
import { CreateHrTaskDto } from "./dto/hr.hrTaskDto";





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

    // Retrieve hr whose full name contains a substring (query param)
    @Get('search')
    async searchHrByFullName(@Query('name') name: string) {
        return await this.hrService.findHrByFullName(name);
    }


    @Get('id/:id')
    getHrId(@Param('id')id: number): string {
        return this.hrService.getHrId(id);
    }

    // Retrieve a hr by username (param)
    @Get('username/:username')
    async getHrByUsername(@Param('username') username: string) {
        return await this.hrService.findHrByUsername(username);
    }

    // Remove a hr by username
    @Delete('username/:username')
    async deleteHrByUsername(@Param('username') username: string) {
        await this.hrService.removeHrByUsername(username);
        return { message: `User with username "${username}" has been removed` };
    }

    // Update a hr by username
    @Patch('username/:username')
    async updateHr(@Param('username') username: string, @Body() updateData: Partial<CreateHrDto>): Promise<HrEntity> {
        return this.hrService.updateHrByUsername(username, updateData);
    }



    //Create new Employee
    @Post('create-employee')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createEmployee(@Body() employeeData: CreateEmployeesDto): Promise<Employees> {
    return this.hrService.createEmployee(employeeData);
    }

    // Update Employee by id
    @Patch('id/:id')
    async updateEmployee(
        @Param('id') id: number, @Body(new ValidationPipe({ skipMissingProperties: true })) updateData: Partial<CreateEmployeesDto>): Promise<Employees>  {
        return this.hrService.updateEmployee(id, updateData);
    }

    // Remove Employee by id
    @Delete('id/:id')
    async deleteEmployee(@Param('id') id: number) {
        await this.hrService.removeEmployee(id);
        return { message: `User with username "${id}" has been removed` };
    }

    @Get('ids')
    async getHrIdsAndNames() {
        return this.hrService.getHrIdsAndNames();
    }

    // Get Employee IDs & Names
    @Get('employees/ids')
    async getEmployeeIdsAndNames() {
        return this.hrService.getEmployeeIdsAndNames();
    }

    // Assign Task to Employee
    @Post('assign-task')
    async assignTask(@Body(new ValidationPipe()) dto: CreateHrTaskDto) {
        return this.hrService.assignTask(dto);
    }

    // Get All Tasks
    @Get('tasks')
    async getAllTasks() {
        return this.hrService.getAllTasks();
    }

    // Get Tasks for Specific Employee
    @Get('tasks/employee/:id')
    async getTasksByEmployee(@Param('id') employeeId: number) {
        return this.hrService.getTasksByEmployee(employeeId);
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

