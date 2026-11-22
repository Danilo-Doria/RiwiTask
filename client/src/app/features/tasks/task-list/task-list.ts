import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { getErrorMessage } from '../../../core/utils/api-error';
import { Status } from '../../../models/enums';
import { STATUS_LABELS } from '../../../models/labels';
import { TaskResponseDTO } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';
import { ConfirmModal } from '../../../shared/confirm-modal/confirm-modal';
import { PriorityBadge } from '../../../shared/priority-badge/priority-badge';
import { StatusBadge } from '../../../shared/status-badge/status-badge';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe, RouterLink, StatusBadge, PriorityBadge, ConfirmModal],
  templateUrl: './task-list.html',
})
export class TaskList implements OnInit {
  private readonly taskService = inject(TaskService);
  protected readonly authService = inject(AuthService);

  protected readonly statuses = Object.values(Status);
  protected readonly statusLabels = STATUS_LABELS;

  protected readonly tasks = signal<TaskResponseDTO[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly filter = signal<Status | null>(null);

  protected readonly taskToDelete = signal<TaskResponseDTO | null>(null);
  protected readonly deleting = signal(false);

  protected readonly filteredTasks = computed(() => {
    const status = this.filter();
    return status ? this.tasks().filter((task) => task.status === status) : this.tasks();
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  protected setFilter(status: Status | null): void {
    this.filter.set(status);
  }

  protected loadTasks(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected requestDelete(task: TaskResponseDTO): void {
    this.taskToDelete.set(task);
  }

  protected confirmDelete(): void {
    const task = this.taskToDelete();
    if (!task) return;

    this.deleting.set(true);
    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.tasks.update((list) => list.filter((t) => t.id !== task.id));
        this.closeDeleteModal();
      },
      error: (error) => {
        this.errorMessage.set(getErrorMessage(error));
        this.closeDeleteModal();
      },
    });
  }

  protected closeDeleteModal(): void {
    this.taskToDelete.set(null);
    this.deleting.set(false);
  }
}