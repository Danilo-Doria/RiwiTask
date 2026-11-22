import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { environment } from '../../../environments/environment';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: { clearSession: ReturnType<typeof vi.fn> };
  let toastServiceSpy: { error: ReturnType<typeof vi.fn> };
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceSpy = { clearSession: vi.fn() };
    toastServiceSpy = { error: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call toastService.error on 403 Forbidden response', () => {
    const testUrl = `${environment.apiUrl}/tasks`;
    const forbiddenResponse = { message: 'No tienes permisos para este recurso' };

    http.get(testUrl).subscribe({
      next: () => expect.unreachable('Should have failed with 403'),
      error: (error) => {
        expect(error.status).toBe(403);
      },
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(forbiddenResponse, { status: 403, statusText: 'Forbidden' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith('No tienes permisos para este recurso');
  });

  it('should clear session and redirect to login on 401 Unauthorized for non-auth requests', () => {
    const testUrl = `${environment.apiUrl}/tasks`;

    http.get(testUrl).subscribe({
      next: () => expect.unreachable('Should have failed with 401'),
      error: (error) => {
        expect(error.status).toBe(401);
      },
    });

    const req = httpMock.expectOne(testUrl);
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.clearSession).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
