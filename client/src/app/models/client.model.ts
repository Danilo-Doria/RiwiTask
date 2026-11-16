import { Role } from "./enums";

export interface ClientRequestDTO {
  name: string;
  email: string;
  password?: string; // el "?" significa opcional
  role?: Role;
}

export interface ClientResponseDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}