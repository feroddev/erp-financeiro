import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Mini ERP Financeiro';
  backendStatus = 'Verificando...';
  backendMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkBackend();
  }

  checkBackend() {
    this.http.get<any>('http://localhost:3000/health').subscribe({
      next: (response) => {
        this.backendStatus = 'Conectado ✓';
        this.backendMessage = `Status: ${response.status}`;
      },
      error: () => {
        this.backendStatus = 'Desconectado ✗';
        this.backendMessage = 'Não foi possível conectar ao backend';
      }
    });
  }
}
