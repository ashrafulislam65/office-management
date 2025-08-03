import { Module } from "@nestjs/common";
import { HrController } from "./hr.controller";
import { HrService } from "./hr.services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HrEntity } from "./hr.entity";



@Module({
    imports: [ TypeOrmModule.forFeature([HrEntity]),],
    controllers:[HrController],
    providers: [HrService],
})

export class HrModule{}