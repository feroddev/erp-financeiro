import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CashflowQueryDto } from './dto/cashflow-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CashflowResponse } from './interfaces/cashflow-response.interface';

@ApiTags('reports')
@ApiBearerAuth('JWT-auth')
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('cashflow')
  @ApiOperation({ summary: 'Relatório de fluxo de caixa' })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiQuery({ name: 'from', required: true, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, description: 'Data final (YYYY-MM-DD)' })
  getCashflow(@Query() query: CashflowQueryDto): Promise<CashflowResponse> {
    return this.reportsService.getCashflow(query);
  }
}
