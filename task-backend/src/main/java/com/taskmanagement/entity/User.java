package com.taskmanagement.entity;

import com.taskmanagement.utils.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(unique = true)
    private String email;
    private String name;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
}
