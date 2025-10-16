import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';
import { TransactionKind, TransactionStatus } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(TransactionKind)
  kind: TransactionKind;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
