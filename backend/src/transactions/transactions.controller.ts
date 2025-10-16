import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova transação' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar transações' })
  @ApiResponse({ status: 200, description: 'Lista de transações retornada com sucesso' })
  @ApiQuery({
    name: 'kind',
    required: false,
    enum: ['PAYABLE', 'RECEIVABLE'],
    description: 'Tipo da transação',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
    description: 'Status da transação',
  })
  @ApiQuery({ name: 'clientId', required: false, description: 'ID do cliente' })
  @ApiQuery({ name: 'from', required: false, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Data final (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  findAll(@Query() filters: FilterTransactionDto) {
    return this.transactionsService.findAll({
      ...filters,
      page: filters.page ? parseInt(filters.page, 10) : undefined,
      limit: filters.limit ? parseInt(filters.limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar transação por ID' })
  @ApiResponse({ status: 200, description: 'Transação encontrada' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar transação' })
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Post(':id/pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar transação como paga' })
  @ApiResponse({ status: 200, description: 'Transação marcada como paga' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  pay(@Param('id') id: string, @Body('paymentDate') paymentDate?: string) {
    return this.transactionsService.pay(id, paymentDate);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover transação' })
  @ApiResponse({ status: 204, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
