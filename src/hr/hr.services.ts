import { Injectable } from "@nestjs/common";



@Injectable()
export class HrService{
    getDashboardData():string{
        return 'Dashboard data for HR.'
    }

    getAdmin(id: number): string {
        return 'Admin ID: ${id}'
    }
}