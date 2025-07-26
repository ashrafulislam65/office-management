import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { HrService } from './hr.services';
import { CreateHrDto } from './dto/hr.dto';



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



    
}
