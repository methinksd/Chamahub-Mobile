import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Default redirect to login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Authentication routes (public)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.page').then(m => m.SignupPage)
  },

  // User routes (protected)
  {
    path: 'select-chama',
    loadComponent: () => import('./features/user/select-chama/select-chama.page').then(m => m.SelectChamaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/user/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard]
  },

  // Keep the original home page for reference (can be removed later)
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
];
