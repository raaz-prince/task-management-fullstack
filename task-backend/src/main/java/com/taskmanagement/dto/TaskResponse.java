package com.taskmanagement.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDate createdAt;
    private LocalDate dueDate;
    private LocalDate updatedAt;
}