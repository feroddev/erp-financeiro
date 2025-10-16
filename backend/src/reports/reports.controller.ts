import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CashflowQueryDto } from './dto/cashflow-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CashflowResponse } from './interfaces/cashflow-response.interface';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('cashflow')
  getCashflow(@Query() query: CashflowQueryDto): Promise<CashflowResponse> {
    return this.reportsService.getCashflow(query);
  }
}
