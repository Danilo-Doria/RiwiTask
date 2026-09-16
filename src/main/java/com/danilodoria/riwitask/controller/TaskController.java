package com.danilodoria.riwitask.controller;

import com.danilodoria.riwitask.dto.request.TaskRequestDTO;
import com.danilodoria.riwitask.dto.response.TaskResponseDTO;
import com.danilodoria.riwitask.entity.Status;
import com.danilodoria.riwitask.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDTO> create(@Valid @RequestBody TaskRequestDTO requestDTO) {
        TaskResponseDTO createdTask = taskService.create(requestDTO);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdTask.id())
                .toUri();

        return ResponseEntity.created(location).body(createdTask);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> findAll() {
        return ResponseEntity.ok(taskService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO requestDTO) {
        return ResponseEntity.ok(taskService.update(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para la consulta filtrada por cliente y estado (ordenada DESC por fecha de creación)
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<TaskResponseDTO>> findByClientIdAndStatus(
            @PathVariable Long clientId,
            @RequestParam Status status) {
        List<TaskResponseDTO> tasks = taskService.findByClientIdAndStatusSorted(clientId, status);
        return ResponseEntity.ok(tasks);
    }
}
