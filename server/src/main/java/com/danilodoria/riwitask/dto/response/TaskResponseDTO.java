package com.danilodoria.riwitask.dto.response;

import com.danilodoria.riwitask.entity.Priority;
import com.danilodoria.riwitask.entity.Status;

import java.time.LocalDateTime;

public record TaskResponseDTO(
        Long id,
        String title,
        String description,
        Status status,
        Priority priority,
        LocalDateTime createdAt,
        ClientResponseDTO client
) {}
