package com.example.employeeapp.dto;

import com.example.employeeapp.entity.EmployeeStatus;
import com.example.employeeapp.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String designation;

    private LocalDate joiningDate;

    private Role role;

    private EmployeeStatus status;

    private Integer leaveBalance;

    private Long departmentId;

    private String departmentName;
}
