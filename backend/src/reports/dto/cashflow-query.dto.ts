import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CashflowQueryDto {
  @ApiProperty({ example: '2025-01-01', description: 'Data inicial (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  from: string;

  @ApiProperty({ example: '2025-01-31', description: 'Data final (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  to: string;
}
