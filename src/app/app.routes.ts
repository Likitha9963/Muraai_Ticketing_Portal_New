import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'tickets', 
    loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent)
  },
  { 
    path: 'tickets/create', 
    loadComponent: () => import('./components/ticket-create/ticket-create.component').then(m => m.TicketCreateComponent)
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
