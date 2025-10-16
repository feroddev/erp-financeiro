import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { Transaction, TransactionStatus, TransactionKind } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async findAll(filters: {
    kind?: TransactionKind;
    status?: TransactionStatus;
    clientId?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Transaction[]; total: number; page: number; totalPages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.kind) {
      where.kind = filters.kind;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.from && filters.to) {
      where.dueDate = Between(new Date(filters.from), new Date(filters.to));
    } else if (filters.from) {
      where.dueDate = Between(new Date(filters.from), new Date('2100-12-31'));
    } else if (filters.to) {
      where.dueDate = LessThanOrEqual(new Date(filters.to));
    }

    const [data, total] = await this.transactionRepository.findAndCount({
      where,
      relations: ['client'],
      order: { dueDate: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);
    Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.transactionRepository.softDelete(id);
  }

  async pay(id: string, paymentDate?: string): Promise<Transaction> {
    const transaction = await this.findOne(id);
    transaction.status = TransactionStatus.PAID;
    transaction.paymentDate = paymentDate ? new Date(paymentDate) : new Date();
    return await this.transactionRepository.save(transaction);
  }

  async markAsOverdue(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.transactionRepository
      .createQueryBuilder()
      .update(Transaction)
      .set({ status: TransactionStatus.OVERDUE })
      .where('status = :status', { status: TransactionStatus.PENDING })
      .andWhere('dueDate < :today', { today })
      .execute();
  }
}
