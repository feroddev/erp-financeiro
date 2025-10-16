import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  Transaction,
  TransactionKind,
  TransactionStatus,
} from '../transactions/entities/transaction.entity';
import { CashflowQueryDto } from './dto/cashflow-query.dto';
import { CashflowResponse } from './interfaces/cashflow-response.interface';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getCashflow(params: CashflowQueryDto): Promise<CashflowResponse> {
    const fromDate = new Date(params.from);
    const toDate = new Date(params.to);

    const transactions = await this.transactionRepository.find({
      where: {
        paymentDate: Between(fromDate, toDate),
        status: TransactionStatus.PAID,
      },
      order: { paymentDate: 'ASC' },
    });

    let totalReceived = 0;
    let totalPaid = 0;
    const timelineMap = new Map<string, { in: number; out: number }>();

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);
      const dateKey = transaction.paymentDate.toISOString().split('T')[0];

      if (!timelineMap.has(dateKey)) {
        timelineMap.set(dateKey, { in: 0, out: 0 });
      }

      const timelineItem = timelineMap.get(dateKey);

      if (transaction.kind === TransactionKind.RECEIVABLE) {
        totalReceived += amount;
        timelineItem.in += amount;
      } else if (transaction.kind === TransactionKind.PAYABLE) {
        totalPaid += amount;
        timelineItem.out += amount;
      }
    });

    const timeline = Array.from(timelineMap.entries())
      .map(([date, values]) => ({
        date,
        in: Number(values.in.toFixed(2)),
        out: Number(values.out.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      period: { from: params.from, to: params.to },
      totals: {
        received: Number(totalReceived.toFixed(2)),
        paid: Number(totalPaid.toFixed(2)),
        balance: Number((totalReceived - totalPaid).toFixed(2)),
      },
      timeline,
    };
  }
}
