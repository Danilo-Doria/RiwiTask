import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

/* 
- Guard: función que el router ejecuta antes de activar una ruta. Si devuelve true, la navegación continúa. Si devuelve otra cosa, se bloquea.

- CanActivateFn: el tipo de un guard funcional. Recibe la ruta que se quiere visitar (route) y el estado del router (state).

- UrlTree: un objeto que representa una URL a la que redirigir. Si el guard devuelve un UrlTree, el router cancela la navegación actual y te manda allí. Es mejor que llamar a router.navigate() dentro del guard, porque deja la redirección dentro del propio flujo de navegación.

- route.data: información extra que le pones a una ruta al definirla. La usaremos para decir qué roles pueden entrar.

- Guard de seguridad vs. UX: un guard del cliente solo mejora la experiencia (oculta pantallas que no puedes usar). La seguridad real la da el backend, que responde 401 o 403 aunque alguien se salte el guard. Por eso tu backend valida todo por su cuenta. */