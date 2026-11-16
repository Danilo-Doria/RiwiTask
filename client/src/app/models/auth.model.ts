import { Role } from './enums';
import { ClientResponseDTO } from './client.model';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface AuthResponseDTO {
  token: string;
  type: string;
  client: ClientResponseDTO;
}

export interface JwtPayload {
  sub: string; // email
  id: number;
  role: Role;
  iat: number;
  exp: number;
}