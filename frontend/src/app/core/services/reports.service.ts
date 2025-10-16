import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";

export interface Transaction {
  id: string;
  kind: "PAYABLE" | "RECEIVABLE";
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  description: string;
  amount: number;
  dueDate: string;
  paymentDate: string | null;
  clientId: string | null;
  notes: string | null;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FinancialSummary {
  totalReceivable: number;
  totalPayable: number;
  balance: number;
  pendingReceivable: number;
  pendingPayable: number;
  overdueReceivable: number;
  overduePayable: number;
}

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<FinancialSummary> {
    return this.http
      .get<TransactionsResponse>(`${this.apiUrl}/transactions`)
      .pipe(map((response) => this.calculateSummary(response.data)));
  }

  private calculateSummary(transactions: Transaction[]): FinancialSummary {
    const summary: FinancialSummary = {
      totalReceivable: 0,
      totalPayable: 0,
      balance: 0,
      pendingReceivable: 0,
      pendingPayable: 0,
      overdueReceivable: 0,
      overduePayable: 0,
    };

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.kind === "RECEIVABLE") {
        summary.totalReceivable += amount;

        if (transaction.status === "PENDING") {
          summary.pendingReceivable += amount;
        } else if (transaction.status === "OVERDUE") {
          summary.overdueReceivable += amount;
        }
      } else if (transaction.kind === "PAYABLE") {
        summary.totalPayable += amount;

        if (transaction.status === "PENDING") {
          summary.pendingPayable += amount;
        } else if (transaction.status === "OVERDUE") {
          summary.overduePayable += amount;
        }
      }
    });

    summary.balance = summary.totalReceivable - summary.totalPayable;

    return summary;
  }
}
