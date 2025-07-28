import { Injectable } from "@nestjs/common";
import { CreateHrDto } from './dto/hr.dto';


@Injectable()
export class HrService{
    getDashboardData():string{
        return 'Dashboard data for HR.'
    }

    getHrId(id: number): string {
        return `Admin ID: ${id}`
    }

    createHr(createHrDto: CreateHrDto): string{
        const { id, name, email, password, phone } = createHrDto;
    return `HR Created: ${id}, ${name}, ${email}, ${password}, ${phone}`;
    }
}