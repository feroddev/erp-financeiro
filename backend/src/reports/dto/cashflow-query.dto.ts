import { IsDateString, IsNotEmpty } from 'class-validator';

export class CashflowQueryDto {
  @IsNotEmpty()
  @IsDateString()
  from: string;

  @IsNotEmpty()
  @IsDateString()
  to: string;
}
