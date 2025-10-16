import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ReportsService, FinancialSummary } from '../../core/services/reports.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  financialSummary: FinancialSummary | null = null;
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private reportsService: ReportsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadFinancialSummary();
  }

  loadFinancialSummary(): void {
    this.loading = true;
    this.error = '';
    
    this.reportsService.getSummary().subscribe({
      next: (data) => {
        this.financialSummary = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar resumo financeiro';
        this.loading = false;
        console.error('Erro:', err);
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
