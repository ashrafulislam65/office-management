import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HrService } from './hr.services';
import { CreateHrDto } from './dto/hr.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { HrEntity } from './hr.entity';
import { Employees } from 'src/employees/employees.entity';
import { CreateEmployeesDto } from 'src/employees/employees.dto';
import { CreateHrTaskDto } from './dto/hr.hrTaskDto';
import { TaskEntity } from './hr.hrTaskEntity';
import { CreateAttendanceDto } from './dto/hr.attendanceDto';
import { AttendanceEntity } from './hr.attendanceEntity';
import { CreateSalaryDto, UpdateSalaryDto } from './dto/hr.salaryDto';
import { HrGuard } from './hr.guard';

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Post()
  async createHr(@Body() createHrDto: CreateHrDto) {
    return await this.hrService.createHr(createHrDto);
  }

  @Get()
  getHr() {
    return this.hrService.getDashboardData();
  }

  // Retrieve hr whose full name contains a substring (query param)
  @Get('search')
  async searchHrByFullName(@Query('name') name: string) {
    return await this.hrService.findHrByFullName(name);
  }

  @Get('id/:id')
  getHrId(@Param('id') id: number): string {
    return this.hrService.getHrId(id);
  }

  // Retrieve a hr by username (param)
  @UseGuards(HrGuard)
  @Get('username/:username')
  async getHrByUsername(@Param('username') username: string) {
    return await this.hrService.findHrByUsername(username);
  }

  // Remove a hr by username
  @UseGuards(HrGuard)
  @Delete('username/:username')
  async deleteHrByUsername(@Param('username') username: string) {
    await this.hrService.removeHrByUsername(username);
    return { message: `User with username "${username}" has been removed` };
  }

  // Update a hr by username
  @Patch('username/:username')
  async updateHr(
    @Param('username') username: string,
    @Body() updateData: Partial<CreateHrDto>,
  ): Promise<HrEntity> {
    return this.hrService.updateHrByUsername(username, updateData);
  }

  //Create new Employee
  @Post('create-employee')
  async createEmployee(
    @Body() employeeData: CreateEmployeesDto,
  ): Promise<Employees> {
    return this.hrService.createEmployee(employeeData);
  }

  // Update Employee by id
  @Patch('id/:id')
  async updateEmployee(
    @Param('id') id: number,
    @Body(new ValidationPipe({ skipMissingProperties: true }))
    updateData: Partial<CreateEmployeesDto>,
  ): Promise<Employees> {
    return this.hrService.updateEmployee(id, updateData);
  }

  // Remove Employee by id
  @Delete('id/:id')
  async deleteEmployee(@Param('id') id: number) {
    await this.hrService.removeEmployee(id);
    return { message: `User with username "${id}" has been removed` };
  }

  // Assign Task to Employee
  @Post('assign-task')
  async assignTask(@Body(new ValidationPipe()) dto: CreateHrTaskDto) {
    return this.hrService.assignTask(dto);
  }

  // Get tasks by hr id
  @Get('tasks/hr/:id')
  getTasksByHr(@Param('id', ParseIntPipe) id: number) {
    return this.hrService.getTasksByHrId(id);
  }

  //Update task
  @Patch('tasks/update/:id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<TaskEntity>,
  ) {
    return this.hrService.updateTask(id, dto);
  }

  //delete task
  @Delete('tasks/delete/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    return await this.hrService.deleteTask(id);
  }

  //Post attendance
  @Post('attendance')
  async markAttendance(@Body() dto: CreateAttendanceDto) {
    return this.hrService.markAttendance(dto);
  }

  //get attendance
  @Get('attendance')
  async getAttendace() {
    return this.hrService.getAttendance();
  }

  //Get Attendance by id
  @Get('attendance/:employeeId')
  async getEmployeeAttendance(@Param('employeeId') id: number) {
    return this.hrService.getAttendanceByEmployee(id);
  }

  //update attendance
  @Patch('attendance/update/:id')
  updateAttendance(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<AttendanceEntity>,
  ) {
    return this.hrService.updateAttendance(id, body);
  }

  //delete attendance
  @Delete('attendance/delete/:id')
  deleteAttendance(@Param('id', ParseIntPipe) id: number) {
    return this.hrService.deleteAttendance(id);
  }

  //create salary
  @Post('salary')
  createSalary(@Body() dto: CreateSalaryDto) {
    return this.hrService.createSalary(dto);
  }

  //get all salary
  @Get('salary')
  getAllSalary() {
    return this.hrService.getAll();
  }

  //get salary by id
  @Get('salary/id/:id')
  getSalaryById(@Param('id') id: number) {
    return this.hrService.getSalaryById(id);
  }

  //update salary
  @Patch('salary/update/:id')
  updateSalary(@Param('id') id: number, @Body() dto: UpdateSalaryDto) {
    return this.hrService.updateSalary(id, dto);
  }

  //delete all salary
  @Delete('salary/delete/:id')
  deleteSalary(@Param('id') id: number) {
    return this.hrService.deleteSalary(id);
  }

  //get salary by employee id
  @Get('salary/employee/:employeeId')
  getSalaryByEmployee(@Param('employeeId') employeeId: number) {
    return this.hrService.getSalariesByEmployeeId(employeeId);
  }

  //SignIn
  @Post('login')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    return this.hrService.hrSignIn(email, password);
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

  //Mailer forget password
  @Post('forgotpassword')
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    return this.hrService.forgotPassword(email);
  }
}
