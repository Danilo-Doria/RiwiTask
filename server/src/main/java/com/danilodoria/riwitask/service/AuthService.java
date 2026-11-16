package com.danilodoria.riwitask.service;

import com.danilodoria.riwitask.dto.request.LoginRequestDTO;
import com.danilodoria.riwitask.dto.request.RegisterRequestDTO;
import com.danilodoria.riwitask.dto.response.AuthResponseDTO;
import com.danilodoria.riwitask.dto.response.ClientResponseDTO;
import com.danilodoria.riwitask.entity.Client;
import com.danilodoria.riwitask.entity.Role;
import com.danilodoria.riwitask.exception.EmailAlreadyExistsException;
import com.danilodoria.riwitask.exception.ResourceNotFoundException;
import com.danilodoria.riwitask.mappers.ClientMapper;
import com.danilodoria.riwitask.repository.ClientRepository;
import com.danilodoria.riwitask.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ClientMapper clientMapper;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO requestDTO) {
        if (clientRepository.existsByEmail(requestDTO.email())) {
            throw new EmailAlreadyExistsException("El correo ya se encuentra registrado");
        }

        Role assignedRole = requestDTO.role() != null ? requestDTO.role() : Role.USER;

        Client client = Client.builder()
                .name(requestDTO.name())
                .email(requestDTO.email())
                .password(passwordEncoder.encode(requestDTO.password()))
                .role(assignedRole)
                .active(true)
                .build();

        Client savedClient = clientRepository.save(client);
        String token = jwtService.generateToken(savedClient);
        ClientResponseDTO clientResponse = clientMapper.toResponseDTO(savedClient);

        return new AuthResponseDTO(token, clientResponse);
    }

    public AuthResponseDTO login(LoginRequestDTO requestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestDTO.email(), requestDTO.password())
        );

        Client client = clientRepository.findByEmail(requestDTO.email())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo: " + requestDTO.email()));

        String token = jwtService.generateToken(client);
        ClientResponseDTO clientResponse = clientMapper.toResponseDTO(client);

        return new AuthResponseDTO(token, clientResponse);
    }
}
