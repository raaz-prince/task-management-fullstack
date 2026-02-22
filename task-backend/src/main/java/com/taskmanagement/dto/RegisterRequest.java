package com.taskmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @Email(message = "provide correct email")
    @NotNull(message = "Email can't be empty")
    private String email;

    @Size(min = 3, message = "name's length should be more than 3")
    @NotNull(message = "name can't be empty")
    @Pattern(regexp = "^[A-Za-z]+( [A-Za-z]+)*$",
            message = "Only letters and single spaces allowed")
    private String name;

    @NotNull(message = "Password can't be empty")
    @Size(min = 8, message = "password should be minimum 8 digits long")
    private String password;
}
