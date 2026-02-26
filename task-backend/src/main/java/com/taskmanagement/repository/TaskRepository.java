package com.taskmanagement.repository;

import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Integer userId);
}
