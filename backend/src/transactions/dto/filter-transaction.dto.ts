import { TransactionKind, TransactionStatus } from '../entities/transaction.entity';

export class FilterTransactionDto {
  kind?: TransactionKind;
  status?: TransactionStatus;
  clientId?: string;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}
