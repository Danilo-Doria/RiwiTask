import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { getErrorMessage, getFieldErrors } from '../../../core/utils/api-error';
import { ClientRequestDTO, ClientResponseDTO } from '../../../models/client.model';
import { Role } from '../../../models/enums';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.html',
})
export class ClientForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);
  protected readonly authService = inject(AuthService);

  // /clients/:id/edit trae id. /profile no.
  readonly id = input<string>();
  protected readonly isProfile = computed(() => this.id() === undefined);

  protected readonly roles = Object.values(Role);

  protected readonly client = signal<ClientResponseDTO | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly fieldErrors = signal<Record<string, string>>({});

  // Solo un admin editando a OTRA persona puede cambiar su rol
  protected readonly canEditRole = computed(() => {
    const target = this.client();
    return this.authService.isAdmin() && target !== null && target.id !== this.authService.currentUser()?.id;
  });

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]], // opcional: vacío = no cambiar
    role: [Role.USER, [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.id();
    const request$ = id ? this.clientService.getById(Number(id)) : this.clientService.getMe();

    request$.subscribe({
      next: (client) => {
        this.client.set(client);
        this.form.patchValue({ name: client.name, email: client.email, role: client.role });
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected onSubmit(): void {
    const client = this.client();
    if (!client) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.fieldErrors.set({});

    const { name, email, password, role } = this.form.getRawValue();
    const dto: ClientRequestDTO = {
      name,
      email,
      // Si el rol no es editable se reenvía el actual, sin cambios
      role: this.canEditRole() ? role : client.role,
      ...(password ? { password } : {}), // solo se envía si el usuario escribió una
    };

    this.clientService.update(client.id, dto).subscribe({
      next: (updated) => this.onSaved(client, updated),
      error: (error) => {
        const fieldErrors = getFieldErrors(error);
        if (Object.keys(fieldErrors).length > 0) {
          this.fieldErrors.set(fieldErrors);
        } else {
          this.errorMessage.set(getErrorMessage(error));
        }
        this.saving.set(false);
      },
    });
  }

  private onSaved(previous: ClientResponseDTO, updated: ClientResponseDTO): void {
    const isSelf = updated.id === this.authService.currentUser()?.id;

    if (isSelf && updated.email !== previous.email) {
      // El token identifica al usuario por email: con uno nuevo hay que volver a entrar
      this.authService.logout();
      return;
    }

    if (isSelf) {
      this.authService.updateCurrentUser(updated);
    }

    this.client.set(updated);
    this.form.controls.password.reset();
    this.saving.set(false);

    if (this.isProfile()) {
      this.successMessage.set('Perfil actualizado correctamente.');
    } else {
      this.router.navigate(['/clients']);
    }
  }
}