import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRequest = req.url.startsWith(`${environment.apiUrl}/auth/`);

      // Token vencido o inválido en una ruta protegida: cerrar sesión y volver al login.
      // Se excluye /auth/*: ahí un 401 significa "credenciales incorrectas" y lo muestra el formulario.
      if (error.status === 401 && !isAuthRequest) {
        authService.clearSession();
        router.navigate(['/login']);
      }

      // Siempre relanzamos el error para que el componente pueda mostrar su mensaje
      return throwError(() => error);
    }),
  );
};