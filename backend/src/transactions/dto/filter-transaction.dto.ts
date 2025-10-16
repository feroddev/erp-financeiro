import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';
import { TransactionKind, TransactionStatus } from '../entities/transaction.entity';

export class FilterTransactionDto {
  @IsOptional()
  @IsEnum(TransactionKind)
  kind?: TransactionKind;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
