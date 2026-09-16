package com.danilodoria.riwitask.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL) // Omite 'errors' en la respuesta si es null
public record ErrorResponseDTO(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        Map<String, String> errors // Para detalles de validación de campos
) {
    // Constructor de conveniencia para errores simples sin lista de campos
    public ErrorResponseDTO(LocalDateTime timestamp, int status, String error, String message) {
        this(timestamp, status, error, message, null);
    }
}
