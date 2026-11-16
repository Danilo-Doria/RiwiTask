package com.danilodoria.riwitask.config;

import com.danilodoria.riwitask.entity.Client;
import com.danilodoria.riwitask.entity.Role;
import com.danilodoria.riwitask.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        final String adminEmail = "admin@gmail.com";

        if (!clientRepository.existsByEmail(adminEmail)) {
            Client admin = Client.builder()
                    .name("admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin12345678"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            clientRepository.save(admin);
            log.info("Usuario Administrador inicial creado exitosamente: {}", adminEmail);
        } else {
            log.info("El usuario Administrador inicial ({}) ya existe en la base de datos.", adminEmail);
        }
    }
}
