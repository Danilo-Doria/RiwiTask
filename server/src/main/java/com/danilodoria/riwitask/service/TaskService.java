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
import com.danilodoria.riwitask.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
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
        if (!SecurityUtils.isOwnerOrAdmin(requestDTO.clientId())) {
            throw new AccessDeniedException("No tienes permiso para crear tareas para otro cliente");
        }

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

        if (!SecurityUtils.isOwnerOrAdmin(task.getClient().getId())) {
            throw new AccessDeniedException("No tienes permiso para ver esta tarea");
        }

        return taskMapper.toResponseDTO(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> findAll() {
        if (SecurityUtils.isAdmin()) {
            return taskRepository.findAll()
                    .stream()
                    .map(taskMapper::toResponseDTO)
                    .toList();
        }

        // Si es rol USER, solo devuelve sus propias tareas ordenadas por fecha
        Long currentClientId = SecurityUtils.getCurrentUser().getId();
        return taskRepository.findByClientIdOrderByCreatedAtDesc(currentClientId)
                .stream()
                .map(taskMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public TaskResponseDTO update(Long id, TaskRequestDTO requestDTO) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada con ID: " + id));

        if (!SecurityUtils.isOwnerOrAdmin(existingTask.getClient().getId())) {
            throw new AccessDeniedException("No tienes permiso para actualizar esta tarea");
        }

        if (!SecurityUtils.isAdmin() && !requestDTO.clientId().equals(existingTask.getClient().getId())) {
            throw new AccessDeniedException("No tienes permiso para reasignar tu tarea a otro cliente");
        }

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
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada con ID: " + id));

        if (!SecurityUtils.isOwnerOrAdmin(task.getClient().getId())) {
            throw new AccessDeniedException("No tienes permiso para eliminar esta tarea");
        }

        taskRepository.delete(task);
    }

    // Consulta filtrada por cliente y estado (ordenada DESC por fecha de creación)
    @Transactional(readOnly = true)
    public List<TaskResponseDTO> findByClientIdAndStatusSorted(Long clientId, Status status) {
        if (!SecurityUtils.isOwnerOrAdmin(clientId)) {
            throw new AccessDeniedException("No tienes permiso para consultar tareas de otro cliente");
        }

        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + clientId);
        }

        return taskRepository.findByClientIdAndStatusOrderByCreatedAtDesc(clientId, status)
                .stream()
                .map(taskMapper::toResponseDTO)
                .toList();
    }
}
