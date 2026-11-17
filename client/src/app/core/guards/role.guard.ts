import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Role } from '../../models/enums';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = (route.data['roles'] ?? []) as Role[];
  const user = authService.currentUser();

  if (user && allowedRoles.includes(user.role)) {
    return true;
  }

  // Con sesión pero sin permiso: a su pantalla principal. Sin sesión: al login.
  return router.createUrlTree([user ? '/tasks' : '/login']);
};

/* ?? [] (Operador Nullish Coalescing): Es un salvavidas de JavaScript. Significa: "Si route.data['roles'] es undefined o null (porque olvidaste ponerle data a la ruta), usa un arreglo vacío [] en su lugar". Esto evita que la aplicación se rompa con un error al intentar recorrer una lista inexistente. */