package com.danilodoria.riwitask.controller;

import com.danilodoria.riwitask.dto.request.ClientRequestDTO;
import com.danilodoria.riwitask.dto.response.ClientResponseDTO;
import com.danilodoria.riwitask.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<ClientResponseDTO> create(@Valid @RequestBody ClientRequestDTO requestDTO) {
        ClientResponseDTO createdClient = clientService.create(requestDTO);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdClient.id())
                .toUri();

        return ResponseEntity.created(location).body(createdClient);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> findAll() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ClientRequestDTO requestDTO) {
        return ResponseEntity.ok(clientService.update(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
