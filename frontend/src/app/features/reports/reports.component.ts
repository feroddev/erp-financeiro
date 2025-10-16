import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionsService, Transaction, TransactionKind, TransactionStatus } from '../../core/services/transactions.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

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
    AlertComponent,
    BaseChartDirective
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

  public barChartType: ChartType = 'bar';
  public pieChartType: ChartType = 'pie';
  public doughnutChartType: ChartType = 'doughnut';

  public barChartData: ChartData<'bar'> = {
    labels: ['A Receber', 'A Pagar'],
    datasets: [
      { data: [0, 0], label: 'Pago', backgroundColor: '#10b981', hoverBackgroundColor: '#059669' },
      { data: [0, 0], label: 'Pendente', backgroundColor: '#f59e0b', hoverBackgroundColor: '#d97706' },
      { data: [0, 0], label: 'Vencido', backgroundColor: '#ef4444', hoverBackgroundColor: '#dc2626' }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${this.formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return 'R$ ' + Number(value).toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  public statusPieData: ChartData<'pie'> = {
    labels: ['Pago', 'Pendente', 'Vencido', 'Cancelado'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
      hoverBackgroundColor: ['#059669', '#d97706', '#dc2626', '#4b5563']
    }]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${this.formatCurrency(value)}`;
          }
        }
      }
    }
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

    this.updateCharts();
  }

  private updateCharts(): void {
    this.barChartData = {
      labels: ['A Receber', 'A Pagar'],
      datasets: [
        {
          data: [this.reportData.paidReceivable, this.reportData.paidPayable],
          label: 'Pago',
          backgroundColor: '#10b981',
          hoverBackgroundColor: '#059669'
        },
        {
          data: [this.reportData.pendingReceivable, this.reportData.pendingPayable],
          label: 'Pendente',
          backgroundColor: '#f59e0b',
          hoverBackgroundColor: '#d97706'
        },
        {
          data: [this.reportData.overdueReceivable, this.reportData.overduePayable],
          label: 'Vencido',
          backgroundColor: '#ef4444',
          hoverBackgroundColor: '#dc2626'
        }
      ]
    };

    const totalPaid = this.reportData.paidReceivable + this.reportData.paidPayable;
    const totalPending = this.reportData.pendingReceivable + this.reportData.pendingPayable;
    const totalOverdue = this.reportData.overdueReceivable + this.reportData.overduePayable;
    const totalCancelled = this.reportData.cancelledReceivable + this.reportData.cancelledPayable;

    this.statusPieData = {
      labels: ['Pago', 'Pendente', 'Vencido', 'Cancelado'],
      datasets: [{
        data: [totalPaid, totalPending, totalOverdue, totalCancelled],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
        hoverBackgroundColor: ['#059669', '#d97706', '#dc2626', '#4b5563']
      }]
    };
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
