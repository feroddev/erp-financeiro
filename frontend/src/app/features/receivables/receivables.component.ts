import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  TransactionsService,
  Transaction,
  TransactionKind,
  TransactionStatus,
  CreateTransactionDto,
  UpdateTransactionDto
} from '../../core/services/transactions.service';
import { ClientsService, Client } from '../../core/services/clients.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-receivables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    TableComponent,
    ButtonComponent,
    SearchInputComponent,
    CardComponent,
    AlertComponent,
    HeaderComponent
  ],
  templateUrl: './receivables.component.html',
  styleUrl: './receivables.component.css'
})
export class ReceivablesComponent implements OnInit {
  transactions: Transaction[] = [];
  clients: Client[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  totalPages = 1;
  total = 0;
  limit = 10;

  filters = {
    status: '',
    clientId: '',
    from: '',
    to: ''
  };

  showFilters = false;

  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedTransaction: Transaction | null = null;

  showDeleteModal = false;
  transactionToDelete: Transaction | null = null;

  transactionForm: CreateTransactionDto = {
    kind: TransactionKind.RECEIVABLE,
    status: TransactionStatus.PENDING,
    description: '',
    amount: 0,
    dueDate: '',
    paymentDate: '',
    clientId: '',
    notes: ''
  };

  TransactionStatus = TransactionStatus;

  tableColumns: TableColumn[] = [
    { key: 'description', label: 'Descrição', class: '' },
    { key: 'client', label: 'Cliente', class: 'hidden sm:table-cell' },
    { key: 'amount', label: 'Valor', class: 'hidden md:table-cell' },
    { key: 'dueDate', label: 'Vencimento', class: 'hidden lg:table-cell' },
    { key: 'status', label: 'Status', class: '' }
  ];

  constructor(
    private transactionsService: TransactionsService,
    private clientsService: ClientsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadClients();
  }

  loadTransactions(): void {
    this.loading = true;
    this.error = '';

    const status = this.filters.status ? (this.filters.status as TransactionStatus) : undefined;

    this.transactionsService
      .getTransactions(
        TransactionKind.RECEIVABLE,
        status,
        this.currentPage,
        this.limit,
        this.filters.clientId || undefined,
        this.filters.from || undefined,
        this.filters.to || undefined
      )
      .subscribe({
        next: (response) => {
          this.transactions = response.data;
          this.total = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar contas a receber';
          this.loading = false;
          console.error('Erro:', err);
        }
      });
  }

  loadClients(): void {
    this.clientsService.getClients('', 1, 1000).subscribe({
      next: (response) => {
        this.clients = response.data;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }

  changeLimit(newLimit: number): void {
    this.limit = newLimit;
    this.currentPage = 1;
    this.loadTransactions();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadTransactions();
  }

  clearFilters(): void {
    this.filters = {
      status: '',
      clientId: '',
      from: '',
      to: ''
    };
    this.currentPage = 1;
    this.loadTransactions();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedTransaction = null;
    this.transactionForm = {
      kind: TransactionKind.RECEIVABLE,
      status: TransactionStatus.PENDING,
      description: '',
      amount: 0,
      dueDate: '',
      paymentDate: '',
      clientId: '',
      notes: ''
    };
    this.showModal = true;
  }

  openEditModal(transaction: Transaction): void {
    this.modalMode = 'edit';
    this.selectedTransaction = transaction;
    this.transactionForm = {
      kind: transaction.kind,
      status: transaction.status,
      description: transaction.description,
      amount: transaction.amount,
      dueDate: transaction.dueDate.split('T')[0],
      paymentDate: transaction.paymentDate ? transaction.paymentDate.split('T')[0] : '',
      clientId: transaction.clientId || '',
      notes: transaction.notes || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTransaction = null;
    this.error = '';
  }

  saveTransaction(): void {
    this.error = '';

    const data = {
      ...this.transactionForm,
      amount: Number(this.transactionForm.amount),
      clientId: this.transactionForm.clientId || undefined,
      paymentDate: this.transactionForm.paymentDate || undefined
    };

    if (this.modalMode === 'create') {
      this.transactionsService.createTransaction(data).subscribe({
        next: () => {
          this.closeModal();
          this.loadTransactions();
        },
        error: (err) => {
          this.error = err.error?.message || 'Erro ao criar conta a receber';
          console.error('Erro:', err);
        }
      });
    } else {
      if (this.selectedTransaction) {
        const updateData: UpdateTransactionDto = {
          status: data.status,
          description: data.description,
          amount: data.amount,
          dueDate: data.dueDate,
          paymentDate: data.paymentDate,
          clientId: data.clientId,
          notes: data.notes
        };

        this.transactionsService
          .updateTransaction(this.selectedTransaction.id, updateData)
          .subscribe({
            next: () => {
              this.closeModal();
              this.loadTransactions();
            },
            error: (err) => {
              this.error = err.error?.message || 'Erro ao atualizar conta a receber';
              console.error('Erro:', err);
            }
          });
      }
    }
  }

  openDeleteModal(transaction: Transaction): void {
    this.transactionToDelete = transaction;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.transactionToDelete = null;
  }

  confirmDelete(): void {
    if (this.transactionToDelete) {
      this.transactionsService.deleteTransaction(this.transactionToDelete.id).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadTransactions();
        },
        error: (err) => {
          this.error = 'Erro ao excluir conta a receber';
          console.error('Erro:', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  markAsPaid(transaction: Transaction): void {
    const today = new Date().toISOString().split('T')[0];
    this.transactionsService.markAsPaid(transaction.id, today).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (err) => {
        this.error = 'Erro ao marcar como pago';
        console.error('Erro:', err);
      }
    });
  }

  getStatusClass(status: TransactionStatus): string {
    const classes = {
      [TransactionStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [TransactionStatus.PAID]: 'bg-green-100 text-green-800',
      [TransactionStatus.OVERDUE]: 'bg-red-100 text-red-800',
      [TransactionStatus.CANCELLED]: 'bg-gray-100 text-gray-800'
    };
    return classes[status] || '';
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

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
