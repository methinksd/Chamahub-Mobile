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
    loadComponent: () => import('./features/user/user-dashboard/user-dashboard.page').then(m => m.UserDashboardPage),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/user/tabs/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'loans',
        loadComponent: () => import('./features/user/tabs/loans/loans.page').then(m => m.LoansPage)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/user/tabs/payments/payments.page').then(m => m.PaymentsPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/tabs/profile/profile.page').then(m => m.ProfilePage)
      }
    ]
  },
  {
    path: 'loan-details/:id',
    loadComponent: () => import('./features/user/loan-details/loan-details.page').then(m => m.LoanDetailsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/user/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthGuard]
  },

  // Admin routes (protected by AdminGuard)
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage),
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'tabs/overview',
        pathMatch: 'full'
      },
      {
        path: 'tabs',
        children: [
          {
            path: 'overview',
            loadComponent: () => import('./features/admin/tabs/overview/admin-overview.page').then(m => m.AdminOverviewPage)
          },
          {
            path: 'loan-approvals',
            loadComponent: () => import('./features/admin/tabs/loan-approvals/loan-approvals.page').then(m => m.LoanApprovalsPage)
          },
          {
            path: 'members',
            loadComponent: () => import('./features/admin/tabs/members/members.page').then(m => m.MembersPage)
          },
          {
            path: 'reports',
            loadComponent: () => import('./features/admin/tabs/reports/reports.page').then(m => m.ReportsPage)
          }
        ]
      }
    ]
  },

  // Keep the original home page for reference (can be removed later)
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
];
