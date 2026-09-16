package com.danilodoria.riwitask.dto.request;

import com.danilodoria.riwitask.entity.Priority;
import com.danilodoria.riwitask.entity.Status;
import jakarta.validation.constraints.*;

public record TaskRequestDTO(
        @NotBlank(message = "El título es obligatorio")
        @Size(max = 100, message = "El título no debe superar los 100 caracteres")
        String title,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 255, message = "La descripción no debe superar los 255 caracteres")
        String description,

        @NotNull(message = "El estado es obligatorio")
        Status status,

        @NotNull(message = "La prioridad es obligatoria")
        Priority priority,

        @NotNull(message = "El ID del cliente es obligatorio")
        Long clientId
) {}
