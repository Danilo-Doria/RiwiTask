package com.danilodoria.riwitask.repository;

import com.danilodoria.riwitask.entity.Status;
import com.danilodoria.riwitask.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByClientIdAndStatusOrderByCreatedAtDesc(Long clientId, Status status);
}
