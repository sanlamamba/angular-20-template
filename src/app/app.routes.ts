import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '@core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('@features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('@features/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
  },
  {
    path: 'profile',
    loadComponent: () => import('@features/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
