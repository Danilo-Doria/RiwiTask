package com.danilodoria.riwitask.dto.response;

public record AuthResponseDTO(
        String token,
        String type,
        ClientResponseDTO client
) {
    public AuthResponseDTO(String token, ClientResponseDTO client) {
        this(token, "Bearer", client);
    }
}
