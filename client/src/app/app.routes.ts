import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tasks/task-list/task-list').then((m) => m.TaskList),
  },
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: '**', redirectTo: 'tasks' },
];

/* 
- loadComponent recibe una función con un import() dinámico: ahí ocurre el lazy loading.

- pathMatch: 'full' hace que la redirección solo aplique a la ruta vacía exacta.
'**' es el comodín: captura cualquier URL desconocida. Debe ir al final, porque el router evalúa en orden.
Si no hay sesión, entrar a /tasks te manda a /login gracias a authGuard. */