import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    service.clear();
  });

  it('should be created with empty toasts', () => {
    expect(service).toBeTruthy();
    expect(service.toasts().length).toBe(0);
  });

  it('should add an error toast', () => {
    service.error('Acceso prohibido');
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Acceso prohibido');
    expect(toasts[0].type).toBe('error');
  });

  it('should add success and info toasts', () => {
    service.success('Guardado correctamente');
    service.info('Información adicional');

    const toasts = service.toasts();
    expect(toasts.length).toBe(2);
    expect(toasts[0].type).toBe('success');
    expect(toasts[1].type).toBe('info');
  });

  it('should dismiss a toast by id', () => {
    service.show('Mensaje 1', 'info');
    service.show('Mensaje 2', 'warning');

    const toasts = service.toasts();
    expect(toasts.length).toBe(2);

    service.dismiss(toasts[0].id);
    const updated = service.toasts();
    expect(updated.length).toBe(1);
    expect(updated[0].message).toBe('Mensaje 2');
  });

  it('should clear all toasts', () => {
    service.show('A');
    service.show('B');
    expect(service.toasts().length).toBe(2);

    service.clear();
    expect(service.toasts().length).toBe(0);
  });
});
