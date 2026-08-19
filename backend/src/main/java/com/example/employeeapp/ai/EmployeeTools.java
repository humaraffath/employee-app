package com.example.employeeapp.ai;

import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class EmployeeTools {
    private final EmployeeRepository employeeRepository;

    @Tool(description = "Get all employees from the employee database")
    public List<Employee> getAllEmployees() {
        System.out.println("TOOL CALLED: getAllEmployees");

        return employeeRepository.findAll();
    }

}
