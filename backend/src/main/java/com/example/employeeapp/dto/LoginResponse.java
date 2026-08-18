package com.example.employeeapp.dto;

import com.example.employeeapp.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private String token;
}
