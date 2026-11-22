import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { getErrorMessage, getFieldErrors } from '../../../core/utils/api-error';
import { ClientResponseDTO } from '../../../models/client.model';
import { Priority, Status } from '../../../models/enums';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../../models/labels';
import { TaskRequestDTO } from '../../../models/task.model';
import { ClientService } from '../../../services/client.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
})
export class TaskForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  private readonly clientService = inject(ClientService);
  protected readonly authService = inject(AuthService);

  // Llega desde la URL (/tasks/:id/edit). Es undefined en /tasks/new
  readonly id = input<string>();
  protected readonly isEdit = computed(() => this.id() !== undefined);

  protected readonly statuses = Object.values(Status);
  protected readonly priorities = Object.values(Priority);
  protected readonly statusLabels = STATUS_LABELS;
  protected readonly priorityLabels = PRIORITY_LABELS;

  protected readonly clients = signal<ClientResponseDTO[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly fieldErrors = signal<Record<string, string>>({});

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    status: [Status.PENDIENTE, [Validators.required]],
    priority: [Priority.MEDIA, [Validators.required]],
    clientId: [0, [Validators.min(1)]],
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();

    if (this.authService.isAdmin()) {
      this.loadClients();
    } else if (user) {
      // Un USER solo puede crear tareas para sí mismo
      this.form.controls.clientId.setValue(user.id);
    }

    const id = this.id();
    if (id) {
      this.loadTask(Number(id));
    }
  }

  private loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients) => this.clients.set(clients),
      error: (error) => this.errorMessage.set(getErrorMessage(error)),
    });
  }

  private loadTask(id: number): void {
    this.loading.set(true);

    this.taskService.getById(id).subscribe({
      next: (task) => {
        this.form.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          clientId: task.client.id,
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.fieldErrors.set({});

    // La forma del formulario coincide con TaskRequestDTO
    const task: TaskRequestDTO = this.form.getRawValue();
    const id = this.id();
    const request$ = id ? this.taskService.update(Number(id), task) : this.taskService.create(task);

    request$.subscribe({
      next: () => this.router.navigate(['/tasks']),
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
}