package com.danilodoria.riwitask.dto.response;

public record ClientResponseDTO(
        Long id,
        String name,
        String email,
        boolean active
) {}