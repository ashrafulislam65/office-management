import { IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  employeeId: number;

  // @IsNotEmpty()
  // empFullName: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  status?: 'present' | 'absent' | 'late';

  @IsNotEmpty()
  checkInTime?: string;

  @IsNotEmpty()
  checkOutTime?: string;
}
