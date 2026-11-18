import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Status } from '../models/enums';
import { TaskRequestDTO, TaskResponseDTO } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  getAll(): Observable<TaskResponseDTO[]> {
    return this.http.get<TaskResponseDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<TaskResponseDTO> {
    return this.http.get<TaskResponseDTO>(`${this.baseUrl}/${id}`);
  }

  getByClient(clientId: number, status?: Status): Observable<TaskResponseDTO[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<TaskResponseDTO[]>(`${this.baseUrl}/client/${clientId}`, { params });
  }

  create(task: TaskRequestDTO): Observable<TaskResponseDTO> {
    return this.http.post<TaskResponseDTO>(this.baseUrl, task);
  }

  update(id: number, task: TaskRequestDTO): Observable<TaskResponseDTO> {
    return this.http.put<TaskResponseDTO>(`${this.baseUrl}/${id}`, task);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

/* 
- En Angular, HttpParams es inmutable; por eso al llamar a params.set('status', status) es obligatorio reasignar el resultado (params = ...). Si status viene definido, Angular construye automáticamente una URL como /tasks/client/5?status=PENDING 

- El servicio solo habla con la API y no guarda estado. Cada método devuelve un Observable, y quien lo llama decide qué hacer con el resultado.

- HttpParams es inmutable, por eso se reasigna params = params.set(...). Genera ?status=PENDIENTE y se encarga de codificar los caracteres.*/