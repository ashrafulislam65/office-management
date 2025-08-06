import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { HrService } from "./hr.services";
import { CreateHrTaskDto } from "./dto/hr.hrTaskDto";

@Controller('tasks')
export class TaskAssignmentController {
    constructor(private readonly taskService: HrService) {}

    @Post('assign')
    async assignTask(@Body() dto: CreateHrTaskDto) {
        return this.taskService.assignTask(dto);
    }

    @Get()
    async getAllTasks() {
        return this.taskService.getAllTasks();
    }

    @Get('employee/:id')
    async getTasksByEmployee(@Param('id') employeeId: number) {
        return this.taskService.getTasksByEmployee(employeeId);
    }
}
