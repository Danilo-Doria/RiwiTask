export interface ErrorResponseDTO {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors?: Record<string, string>; // campo -> mensaje (cuando status es 400)
}