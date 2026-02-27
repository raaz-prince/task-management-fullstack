package com.taskmanagement.controller;

import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.dto.UpdateTaskRequest;
import com.taskmanagement.entity.Status;
import com.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/")
    public ResponseEntity<?> getTasks() {
        return ResponseEntity.ok("success fully preauthorize works!");
    }

    @PostMapping("/add-task")
    public ResponseEntity<TaskResponse> addTask(
            @Valid @RequestBody TaskRequest taskRequest,
            Principal principal
            ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.addTask(taskRequest, principal.getName()));
    }

    @GetMapping("/get-tasks")
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            Principal principal
    ) {
        return ResponseEntity.ok(taskService.getAllTasks(principal.getName()));
    }

    @DeleteMapping("/delete-task/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Principal principal){
        taskService.deleteTask(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam Status status,
            Principal principal
            ){
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status, principal.getName()));
    }

    @PutMapping("/update-task/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest taskRequest,
            Principal principal
    ){
        return ResponseEntity.ok(taskService.updateTask(id, taskRequest, principal.getName()));
    }
}
