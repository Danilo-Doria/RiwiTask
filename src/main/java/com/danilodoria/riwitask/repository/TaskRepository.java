package com.danilodoria.riwitask.repository;

import com.danilodoria.riwitask.entity.Client;
import com.danilodoria.riwitask.entity.Priority;
import com.danilodoria.riwitask.entity.Status;
import com.danilodoria.riwitask.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Client, Long> {

    List<Task> findByClientId(Long clientId);

    List<Task> findByStatus(String status);

    List<Task> findByPriority(Priority priority);

    List<Task> findByClientIdAndStatus(Long userId, Status status);

    List<Task> findByClientIdAndStatusOrderByCreatedAtDesc(Long clientId, Status status);
}
