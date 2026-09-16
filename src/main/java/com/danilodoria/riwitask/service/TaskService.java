package com.danilodoria.riwitask.service;

import com.danilodoria.riwitask.dto.request.TaskRequestDTO;
import com.danilodoria.riwitask.dto.response.TaskResponseDTO;
import com.danilodoria.riwitask.entity.Client;
import com.danilodoria.riwitask.entity.Status;
import com.danilodoria.riwitask.entity.Task;
import com.danilodoria.riwitask.exception.ResourceNotFoundException;
import com.danilodoria.riwitask.mappers.TaskMapper;
import com.danilodoria.riwitask.repository.ClientRepository;
import com.danilodoria.riwitask.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ClientRepository clientRepository;
    private final TaskMapper taskMapper;

    @Transactional
    public TaskResponseDTO create(TaskRequestDTO requestDTO) {
        Client client = clientRepository.findById(requestDTO.clientId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + requestDTO.clientId()));

        Task task = taskMapper.toEntity(requestDTO);

        task.setClient(client);

        Task savedTask = taskRepository.save(task);
        return taskMapper.toResponseDTO(savedTask);
    }

    @Transactional(readOnly = true)
    public TaskResponseDTO findById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada con ID: " + id));
        return taskMapper.toResponseDTO(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> findAll() {
        return taskRepository.findAll()
                .stream()
                .map(taskMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public TaskResponseDTO update(Long id, TaskRequestDTO requestDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada con ID: " + id));

        if (!existingTask.getClient().getId().equals(requestDTO.clientId())) {
            Client newClient = clientRepository.findById(requestDTO.clientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + requestDTO.clientId()));
            existingTask.setClient(newClient);
        }

        existingTask.setTitle(requestDTO.title());
        existingTask.setDescription(requestDTO.description());
        existingTask.setStatus(requestDTO.status());
        existingTask.setPriority(requestDTO.priority());

        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.toResponseDTO(updatedTask);
    }

    @Transactional
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tarea no encontrada con ID: " + id);
        }
        taskRepository.deleteById(id);
    }

    // Consulta especial requerida
    @Transactional(readOnly = true)
    public List<TaskResponseDTO> findByClientIdAndStatusSorted(Long clientId, Status status) {
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + clientId);
        }

        return taskRepository.findByClientIdAndStatusOrderByCreatedAtDesc(clientId, status)
                .stream()
                .map(taskMapper::toResponseDTO)
                .toList();
    }
}
