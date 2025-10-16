import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientsComponent } from './features/clients/clients.component';
import { ReceivablesComponent } from './features/receivables/receivables.component';
import { PayablesComponent } from './features/payables/payables.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'clients', 
    component: ClientsComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'receivables', 
    component: ReceivablesComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'payables', 
    component: PayablesComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
