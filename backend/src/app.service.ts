import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Mini ERP Financeiro - Backend API';
  }
}
