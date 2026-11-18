import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { getErrorMessage } from '../../../core/utils/api-error';
import { passwordsMatch } from '../../../core/utils/validators';
import { ErrorResponseDTO } from '../../../models/error.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string>>({});

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordsMatch] },
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.fieldErrors.set({});

    // confirmPassword es solo para validar en el cliente: no se envía al backend
    const { name, email, password } = this.form.getRawValue();

    this.authService.register({ name, email, password }).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (error) => {
        const body = error instanceof HttpErrorResponse ? (error.error as Partial<ErrorResponseDTO>) : null;
        // 400: errores por campo. Cualquier otro (409 email duplicado, red caída...): mensaje general
        if (error.status === 400 && body?.errors) {
          this.fieldErrors.set(body.errors);
        } else {
          this.errorMessage.set(getErrorMessage(error));
        }
        this.loading.set(false);
      },
    });
  }
}