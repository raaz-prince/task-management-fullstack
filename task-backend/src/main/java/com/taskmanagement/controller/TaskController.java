package com.taskmanagement.controller;

import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/task")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getTasks() {
        return ResponseEntity.ok("success fully preauthorize works!");
    }

    @PostMapping("/create-task")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TaskResponse> addTask(
            @Valid @RequestBody TaskRequest taskRequest
            ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.addTask(taskRequest));
    }
}
