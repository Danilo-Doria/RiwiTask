import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { getErrorMessage } from '../../../core/utils/api-error';
import { ClientResponseDTO } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';
import { ConfirmModal } from '../../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-client-list',
  imports: [RouterLink, ConfirmModal],
  templateUrl: './client-list.html',
})
export class ClientList implements OnInit {
  private readonly clientService = inject(ClientService);
  protected readonly authService = inject(AuthService);

  protected readonly clients = signal<ClientResponseDTO[]>([]);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly clientToDelete = signal<ClientResponseDTO | null>(null);
  protected readonly deleting = signal(false);

  ngOnInit(): void {
    this.loadClients();
  }

  protected loadClients(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(getErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected requestDelete(client: ClientResponseDTO): void {
    this.clientToDelete.set(client);
  }

  protected confirmDelete(): void {
    const client = this.clientToDelete();
    if (!client) return;

    this.deleting.set(true);
    this.clientService.delete(client.id).subscribe({
      next: () => {
        this.clients.update((list) => list.filter((c) => c.id !== client.id));
        this.closeDeleteModal();
      },
      error: (error) => {
        this.errorMessage.set(getErrorMessage(error));
        this.closeDeleteModal();
      },
    });
  }

  protected closeDeleteModal(): void {
    this.clientToDelete.set(null);
    this.deleting.set(false);
  }
}