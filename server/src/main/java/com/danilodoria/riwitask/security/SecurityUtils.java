package com.danilodoria.riwitask.security;

import com.danilodoria.riwitask.entity.Client;
import com.danilodoria.riwitask.entity.Role;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static Client getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Client client) {
            return client;
        }
        throw new AccessDeniedException("No se encuentra usuario autenticado en la petición");
    }

    public static boolean isAdmin() {
        return getCurrentUser().getRole() == Role.ADMIN;
    }

    public static boolean isOwnerOrAdmin(Long clientId) {
        Client current = getCurrentUser();
        return current.getRole() == Role.ADMIN || current.getId().equals(clientId);
    }
}
