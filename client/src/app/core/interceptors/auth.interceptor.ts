import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // token(): se lee como función porque es un signal, y siempre trae el valor actual.  
  const token = inject(AuthService).token();

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isPublicEndpoint = req.url.startsWith(`${environment.apiUrl}/auth/`);

  // Sin token, o hacia otro dominio, o login/register: pasa sin tocar
  if (!token || !isApiRequest || isPublicEndpoint) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};