import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDTO } from '../../models/error.model';

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }
    const body = error.error as Partial<ErrorResponseDTO> | null;
    if (body?.message) {
      return body.message;
    }
  }
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}

/* - error: unknown. En TypeScript moderno, los errores capturados tienen por defecto el tipo unknown (desconocido), porque en JavaScript se puede lanzar cualquier cosa como error (un texto, un objeto HTTP, un fallo de código). 

- instanceof HttpErrorResponse. Comprueba si el fallo proviene realmente de una petición hecha con HttpClient (y no de un error de sintaxis o de JavaScript local). Si es un error de red, entra al bloque; si no, salta directamente al mensaje genérico del final.

- error.error. En Angular, dentro del objeto HttpErrorResponse, la propiedad .error contiene el cuerpo JSON que envió tu backend (por ejemplo: { status: 401, message: "Credenciales inválidas" }).

- as Partial<ErrorResponseDTO> | null. Le dice a TypeScript que trate ese cuerpo como un objeto que podría tener las propiedades de tu modelo ErrorResponseDTO (usando Partial porque a veces un servidor devuelve un HTML o texto vacío en lugar del JSON esperado).

- if (body?.message). Usa el encadenamiento opcional (?.) para verificar de forma segura si existe la propiedad message dentro del JSON. Si existe (por ejemplo, "El correo ya está registrado"), devuelve exactamente ese texto.
*/