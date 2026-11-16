package com.danilodoria.riwitask.dto.response;

import com.danilodoria.riwitask.entity.Role;

public record ClientResponseDTO(
        Long id,
        String name,
        String email,
        Role role,
        boolean active
) {}
