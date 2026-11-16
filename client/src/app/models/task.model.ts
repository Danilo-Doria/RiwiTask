import { Priority, Status } from './enums';
import { ClientResponseDTO } from './client.model';

export interface TaskRequestDTO {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  clientId: number;
}

export interface TaskResponseDTO {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string; // ISO-8601, llega como texto
  client: ClientResponseDTO;
}