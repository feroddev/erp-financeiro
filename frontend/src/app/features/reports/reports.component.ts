import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionsService, Transaction, TransactionKind, TransactionStatus } from '../../core/services/transactions.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

interface ReportData {
  totalReceivable: number;
  totalPayable: number;
  balance: number;
  paidReceivable: number;
  paidPayable: number;
  pendingReceivable: number;
  pendingPayable: number;
  overdueReceivable: number;
  overduePayable: number;
  cancelledReceivable: number;
  cancelledPayable: number;
  transactions: Transaction[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    CardComponent,
    ButtonComponent,
    AlertComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  loading = false;
  error = '';
  reportGenerated = false;

  filters = {
    from: '',
    to: ''
  };

  reportData: ReportData = {
    totalReceivable: 0,
    totalPayable: 0,
    balance: 0,
    paidReceivable: 0,
    paidPayable: 0,
    pendingReceivable: 0,
    pendingPayable: 0,
    overdueReceivable: 0,
    overduePayable: 0,
    cancelledReceivable: 0,
    cancelledPayable: 0,
    transactions: []
  };

  constructor(
    private transactionsService: TransactionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.filters.from = firstDay.toISOString().split('T')[0];
    this.filters.to = today.toISOString().split('T')[0];
  }

  generateReport(): void {
    if (!this.filters.from || !this.filters.to) {
      this.error = 'Por favor, selecione o período do relatório';
      return;
    }

    if (new Date(this.filters.from) > new Date(this.filters.to)) {
      this.error = 'A data inicial não pode ser maior que a data final';
      return;
    }

    this.loading = true;
    this.error = '';
    this.reportGenerated = false;

    this.transactionsService
      .getTransactions(undefined, undefined, 1, 10000, undefined, this.filters.from, this.filters.to)
      .subscribe({
        next: (response) => {
          this.calculateReport(response.data);
          this.reportGenerated = true;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao gerar relatório';
          this.loading = false;
          console.error('Erro:', err);
        }
      });
  }

  private calculateReport(transactions: Transaction[]): void {
    this.reportData = {
      totalReceivable: 0,
      totalPayable: 0,
      balance: 0,
      paidReceivable: 0,
      paidPayable: 0,
      pendingReceivable: 0,
      pendingPayable: 0,
      overdueReceivable: 0,
      overduePayable: 0,
      cancelledReceivable: 0,
      cancelledPayable: 0,
      transactions: transactions
    };

    transactions.forEach(transaction => {
      const amount = Number(transaction.amount);

      if (transaction.kind === TransactionKind.RECEIVABLE) {
        this.reportData.totalReceivable += amount;

        switch (transaction.status) {
          case TransactionStatus.PAID:
            this.reportData.paidReceivable += amount;
            break;
          case TransactionStatus.PENDING:
            this.reportData.pendingReceivable += amount;
            break;
          case TransactionStatus.OVERDUE:
            this.reportData.overdueReceivable += amount;
            break;
          case TransactionStatus.CANCELLED:
            this.reportData.cancelledReceivable += amount;
            break;
        }
      } else if (transaction.kind === TransactionKind.PAYABLE) {
        this.reportData.totalPayable += amount;

        switch (transaction.status) {
          case TransactionStatus.PAID:
            this.reportData.paidPayable += amount;
            break;
          case TransactionStatus.PENDING:
            this.reportData.pendingPayable += amount;
            break;
          case TransactionStatus.OVERDUE:
            this.reportData.overduePayable += amount;
            break;
          case TransactionStatus.CANCELLED:
            this.reportData.cancelledPayable += amount;
            break;
        }
      }
    });

    this.reportData.balance = this.reportData.totalReceivable - this.reportData.totalPayable;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getStatusLabel(status: TransactionStatus): string {
    const labels = {
      [TransactionStatus.PENDING]: 'Pendente',
      [TransactionStatus.PAID]: 'Pago',
      [TransactionStatus.OVERDUE]: 'Vencido',
      [TransactionStatus.CANCELLED]: 'Cancelado'
    };
    return labels[status] || status;
  }

  getKindLabel(kind: TransactionKind): string {
    return kind === TransactionKind.RECEIVABLE ? 'A Receber' : 'A Pagar';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  printReport(): void {
    window.print();
  }
}
