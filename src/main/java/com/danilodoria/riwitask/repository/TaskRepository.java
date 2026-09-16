package com.danilodoria.riwitask.repository;

import com.danilodoria.riwitask.entity.Client;
import com.danilodoria.riwitask.entity.PriorityEnum;
import com.danilodoria.riwitask.entity.StatusEnum;
import com.danilodoria.riwitask.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Client, Long> {

    List<Task> findByClientId(Long clientId);

    List<Task> findByStatus(String status);

    List<Task> findByPriority(PriorityEnum priority);

    List<Task> findByClientIdAndStatus(Long userId, StatusEnum status);

    List<Task> findByClientIdAndStatusOrderByCreatedAtDesc(Long clientId, StatusEnum status);
}
