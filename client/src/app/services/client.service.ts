import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ClientRequestDTO, ClientResponseDTO } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/clients`;

  getAll(): Observable<ClientResponseDTO[]> {
    return this.http.get<ClientResponseDTO[]>(this.baseUrl);
  }

  getMe(): Observable<ClientResponseDTO> {
    return this.http.get<ClientResponseDTO>(`${this.baseUrl}/me`);
  }

  getById(id: number): Observable<ClientResponseDTO> {
    return this.http.get<ClientResponseDTO>(`${this.baseUrl}/${id}`);
  }

  update(id: number, client: ClientRequestDTO): Observable<ClientResponseDTO> {
    return this.http.put<ClientResponseDTO>(`${this.baseUrl}/${id}`, client);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}