package com.danilodoria.riwitask.service;

import com.danilodoria.riwitask.dto.request.ClientRequestDTO;
import com.danilodoria.riwitask.dto.request.ClientUpdateRequestDTO;
import com.danilodoria.riwitask.dto.response.ClientResponseDTO;
import com.danilodoria.riwitask.entity.Client;
import com.danilodoria.riwitask.entity.Role;
import com.danilodoria.riwitask.exception.EmailAlreadyExistsException;
import com.danilodoria.riwitask.exception.ResourceNotFoundException;
import com.danilodoria.riwitask.mappers.ClientMapper;
import com.danilodoria.riwitask.repository.ClientRepository;
import com.danilodoria.riwitask.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ClientResponseDTO create(ClientRequestDTO requestDTO) {
        if (!SecurityUtils.isAdmin()) {
            throw new AccessDeniedException("Solo los administradores pueden crear clientes directamente. Usa /auth/register.");
        }

        if (clientRepository.existsByEmail(requestDTO.email())) {
            throw new EmailAlreadyExistsException("El correo " + requestDTO.email() + " ya se encuentra registrado.");
        }

        Role role = requestDTO.role() != null ? requestDTO.role() : Role.USER;

        Client client = Client.builder()
                .name(requestDTO.name())
                .email(requestDTO.email())
                .password(passwordEncoder.encode(requestDTO.password()))
                .role(role)
                .active(true)
                .build();

        Client savedClient = clientRepository.save(client);
        return clientMapper.toResponseDTO(savedClient);
    }

    @Transactional(readOnly = true)
    public ClientResponseDTO findById(Long id) {
        if (!SecurityUtils.isOwnerOrAdmin(id)) {
            throw new AccessDeniedException("No tienes permiso para ver el perfil de otro cliente");
        }

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con el ID: " + id));
        return clientMapper.toResponseDTO(client);
    }

    @Transactional(readOnly = true)
    public ClientResponseDTO getMe() {
        Client current = SecurityUtils.getCurrentUser();
        return clientMapper.toResponseDTO(current);
    }

    @Transactional(readOnly = true)
    public List<ClientResponseDTO> findAll() {
        if (!SecurityUtils.isAdmin()) {
            throw new AccessDeniedException("Solo los administradores pueden consultar el listado completo de clientes");
        }

        return clientRepository.findAll()
                .stream()
                .map(clientMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public ClientResponseDTO update(Long id, ClientUpdateRequestDTO requestDTO) {
        if (!SecurityUtils.isOwnerOrAdmin(id)) {
            throw new AccessDeniedException("No tienes permiso para actualizar este cliente");
        }

        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con el ID: " + id));

        // Si cambia de email, validar que el nuevo no esté en uso por otro cliente
        if (!existingClient.getEmail().equalsIgnoreCase(requestDTO.email())
                && clientRepository.existsByEmail(requestDTO.email())) {
            throw new EmailAlreadyExistsException("El correo " + requestDTO.email() + " ya está en uso.");
        }

        existingClient.setName(requestDTO.name());
        existingClient.setEmail(requestDTO.email());
        if (requestDTO.password() != null && !requestDTO.password().isBlank()) {
            existingClient.setPassword(passwordEncoder.encode(requestDTO.password()));
        }

        // Solo el admin puede cambiar el rol
        if (requestDTO.role() != null && SecurityUtils.isAdmin()) {
            boolean demotingSelf = existingClient.getRole() == Role.ADMIN
                    && requestDTO.role() != Role.ADMIN
                    && SecurityUtils.isOwner(id);
            if (demotingSelf) {
                throw new AccessDeniedException("No puedes quitarte tu propio rol de administrador");
            }
            existingClient.setRole(requestDTO.role());
        }

        Client updatedClient = clientRepository.save(existingClient);
        return clientMapper.toResponseDTO(updatedClient);
    }

    @Transactional
    public void delete(Long id) {
        if (!SecurityUtils.isAdmin()) {
            throw new AccessDeniedException("Solo los administradores pueden eliminar clientes");
        }

        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente no encontrado con el ID: " + id);
        }
        clientRepository.deleteById(id);
    }
}
