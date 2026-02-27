package com.taskmanagement.service;

import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.dto.UpdateTaskRequest;
import com.taskmanagement.entity.Status;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.User;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional
    public TaskResponse addTask(TaskRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(Status.TO_DO)
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);

        return convertToResponse(savedTask);
    }

    @Transactional
    public List<TaskResponse> getAllTasks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return taskRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    @Transactional
    public void deleteTask(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to perform this action");
        }

        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, Status status, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to perform this action");
        }

        task.setStatus(status);
        task.setUpdatedAt(LocalDate.now());
        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to perform this action");
        }

        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setDueDate(req.getDueDate());
        task.setUpdatedAt(LocalDate.now());

        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    private TaskResponse convertToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .createdAt(task.getCreatedAt())
                .dueDate(task.getDueDate())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
