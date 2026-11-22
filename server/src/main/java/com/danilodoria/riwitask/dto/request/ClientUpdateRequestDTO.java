package com.danilodoria.riwitask.dto.request;

import com.danilodoria.riwitask.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClientUpdateRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 255, message = "El nombre no debe superar los 255 caracteres")
        String name,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El formato del correo electrónico no es válido")
        @Size(max = 150, message = "El correo no debe superar los 150 caracteres")
        String email,

        @Size(min = 6, max = 255, message = "La contraseña debe tener al menos 6 caracteres")
        String password, // opcional: null = no cambiar

        Role role
) {
}
