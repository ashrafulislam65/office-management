import { Controller, Get, Param } from "@nestjs/common";
import { HrService } from './hr.services';


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


    
}
