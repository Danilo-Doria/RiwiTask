package com.danilodoria.riwitask.service;

import com.danilodoria.riwitask.dto.request.ClientRequestDTO;
import com.danilodoria.riwitask.dto.response.ClientResponseDTO;
import com.danilodoria.riwitask.entity.Client;
import com.danilodoria.riwitask.exception.EmailAlreadyExistsException;
import com.danilodoria.riwitask.exception.ResourceNotFoundException;
import com.danilodoria.riwitask.mappers.ClientMapper;
import com.danilodoria.riwitask.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Transactional
    public ClientResponseDTO create(ClientRequestDTO RequestDTO) {
        if (clientRepository.existsByEmail(RequestDTO.email())) {
            throw new EmailAlreadyExistsException("El correo " + RequestDTO.email() + " ya se encuentra registrado.");
        }

        Client client = clientMapper.toEntity(RequestDTO);
        Client savedClient = clientRepository.save(client);
        return clientMapper.toResponseDTO(savedClient);
    }

    @Transactional(readOnly = true)
    public ClientResponseDTO findById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con el ID: " + id));
        return clientMapper.toResponseDTO(client);
    }

    @Transactional(readOnly = true)
    public List<ClientResponseDTO> findAll() {
        return clientRepository.findAll()
                .stream()
                .map(clientMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public ClientResponseDTO update(Long id, ClientRequestDTO requestDTO) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con el ID: " + id));

        // Si cambia de email, validar que el nuevo no esté en uso por otro cliente
        if (!existingClient.getEmail().equalsIgnoreCase(requestDTO.email())
                && clientRepository.existsByEmail(requestDTO.email())) {
            throw new EmailAlreadyExistsException("El correo " + requestDTO.email() + " ya está en uso.");
        }

        existingClient.setName(requestDTO.name());
        existingClient.setEmail(requestDTO.email());
        existingClient.setPassword(requestDTO.password());

        Client updatedClient = clientRepository.save(existingClient);
        return clientMapper.toResponseDTO(updatedClient);
    }

    @Transactional
    public void delete(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente no encontrado con el ID: " + id);
        }
        clientRepository.deleteById(id);
    }
}
