import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './models/enums';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    // Ruta padre sin segmento propio: solo aporta el layout y el guard
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/task-list/task-list').then((m) => m.TaskList),
      },
      {
        path: 'tasks/new',
        loadComponent: () => import('./features/tasks/task-form/task-form').then((m) => m.TaskForm),
      },
      {
        path: 'tasks/:id/edit',
        loadComponent: () => import('./features/tasks/task-form/task-form').then((m) => m.TaskForm),
      },
      {
        path: 'clients',
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/clients/client-list/client-list').then((m) => m.ClientList),
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/clients/client-form/client-form').then((m) => m.ClientForm),
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/clients/client-form/client-form').then((m) => m.ClientForm),
      },
      { path: '', pathMatch: 'full', redirectTo: 'tasks' },
    ],
  },
  { path: '**', redirectTo: 'tasks' },
];