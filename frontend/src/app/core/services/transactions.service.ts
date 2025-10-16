import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum TransactionKind {
  PAYABLE = 'PAYABLE',
  RECEIVABLE = 'RECEIVABLE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface Transaction {
  id: string;
  kind: TransactionKind;
  status: TransactionStatus;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  clientId?: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  kind: TransactionKind;
  status: TransactionStatus;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  clientId?: string;
  notes?: string;
}

export interface UpdateTransactionDto {
  status?: TransactionStatus;
  description?: string;
  amount?: number;
  dueDate?: string;
  paymentDate?: string;
  clientId?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(
    kind?: TransactionKind,
    status?: TransactionStatus,
    page: number = 1,
    limit: number = 10,
    clientId?: string,
    from?: string,
    to?: string
  ): Observable<PaginatedResponse<Transaction>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (kind) {
      params = params.set('kind', kind);
    }

    if (status) {
      params = params.set('status', status);
    }

    if (clientId) {
      params = params.set('clientId', clientId);
    }

    if (from) {
      params = params.set('from', from);
    }

    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<PaginatedResponse<Transaction>>(this.apiUrl, { params });
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(data: CreateTransactionDto): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, data);
  }

  updateTransaction(id: string, data: UpdateTransactionDto): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.apiUrl}/${id}`, data);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAsPaid(id: string, paymentDate: string): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.apiUrl}/${id}`, {
      status: TransactionStatus.PAID,
      paymentDate
    });
  }

  markAsCancelled(id: string): Observable<Transaction> {
    return this.http.patch<Transaction>(`${this.apiUrl}/${id}`, {
      status: TransactionStatus.CANCELLED
    });
  }
}
