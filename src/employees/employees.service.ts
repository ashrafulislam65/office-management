import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {
    Employees(): string {
        return 'List of Employees';
    }
}
