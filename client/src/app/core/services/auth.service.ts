import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Role } from '../../models/enums';
import { ClientResponseDTO } from '../../models/client.model';
import {
  AuthResponseDTO,
  JwtPayload,
  LoginRequestDTO,
  RegisterRequestDTO,
} from '../../models/auth.model';

const TOKEN_KEY = 'riwitask_token';
const USER_KEY = 'riwitask_user';

/* - @Injectable() es un decorador de Angular que marca una clase de TypeScript como un servicio que puede ser inyectado en otros componentes.

- providedIn: 'root'. Le indica a Angular que cree una única instancia global (Singleton)
*/
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  // Estado privado: solo este servicio puede modificarlo
  private readonly _token = signal<string | null>(null);
  private readonly _currentUser = signal<ClientResponseDTO | null>(null);

  // Estado público de solo lectura
  readonly token = this._token.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  // Valores derivados
  // Computed() se usa para calcular valores automáticamente cada vez que _token o _currentUser cambian
  readonly isAuthenticated = computed(() => this._token() !== null && this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === Role.ADMIN);

  constructor() {
    this.restoreSession();
  }

    login(credentials: LoginRequestDTO): Observable<AuthResponseDTO> {
    // HttpClient.post no devuelve los datos al instante, devuelve un Observable
    // (un flujo asíncrono de RxJS que emitirá la respuesta cuando el backend conteste).
    // Nota: La petición HTTP solo se dispara cuando un componente hace .subscribe().
    return this.http
      .post<AuthResponseDTO>(`${this.baseUrl}/login`, credentials)
      .pipe(
        // .pipe() abre una "tubería" para interceptar la respuesta antes de entregarla al componente.
        // tap() actúa como un "espía": lee la respuesta exitosa, ejecuta un efecto secundario (guardar el token y usuario en el servicio) y deja pasar la respuesta intacta.
        tap((response) => this.saveSession(response))
      );
  }

  register(data: RegisterRequestDTO): Observable<AuthResponseDTO> {
    return this.http
      .post<AuthResponseDTO>(`${this.baseUrl}/register`, data)
      .pipe(tap((response) => this.saveSession(response)));
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /** Limpia la sesión sin navegar (lo usará el interceptor en un 401). */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._currentUser.set(null);
  }

  private saveSession(response: AuthResponseDTO): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.client));
    this._token.set(response.token);
    this._currentUser.set(response.client);
  }

  /** Al abrir la app (o recargar), recupera la sesión guardada si sigue vigente. */
  private restoreSession(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);

    if (!token || !userJson || this.isTokenExpired(token)) {
      this.clearSession();
      return;
    }

    try {
      this._token.set(token);
      this._currentUser.set(JSON.parse(userJson) as ClientResponseDTO);
    } catch {
      this.clearSession(); // JSON corrupto
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    return payload.exp * 1000 <= Date.now(); // exp viene en segundos
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64)) as JwtPayload;
    } catch {
      return null;
    }
  }
}

/* 
¿Qué es RxJS y qué es un Observable?

• RxJS (Reactive Extensions for JavaScript). Es una librería incluida en Angular especializada en manejar eventos y datos que llegan en el futuro (peticiones a internet, clics, temporizadores).
• Observable. Es una promesa vitaminada o un canal de datos. Cuando haces this.http.post(...), el servidor tarda unos milisegundos en responder. En lugar de congelar la pantalla esperando, HttpClient te entrega un Observable, que significa: "Aquí tienes el tubo; cuando el servidor responda, el dato saldrá por aquí".
• Regla de oro (Lazy/Perezoso). Un Observable no hace nada hasta que alguien se conecta a él usando .subscribe() desde el componente. Si nadie se suscribe, la petición HTTP ni siquiera sale hacia internet.
*/
