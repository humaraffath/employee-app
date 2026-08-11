package com.example.employeeapp.dto;

import com.example.employeeapp.entity.EmployeeStatus;
import com.example.employeeapp.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String phone;

    private String designation;

    private LocalDate joiningDate;

    @NotNull(message = "Role is required")
    private Role role;

    @NotNull(message = "Status is required")
    private EmployeeStatus status;

    @NotNull(message = "Leave balance is required")
    @Min(value = 0, message = "Leave balance cannot be negative")
    private Integer leaveBalance;

    @NotNull(message = "Department id is required")
    private Long departmentId;
}
