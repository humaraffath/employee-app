package com.example.employeeapp.service;

import com.example.employeeapp.dto.EmployeeRequest;
import com.example.employeeapp.dto.EmployeeResponse;
import com.example.employeeapp.dto.RegisterRequest;
import com.example.employeeapp.entity.Department;
import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.entity.EmployeeStatus;
import com.example.employeeapp.entity.Role;
import com.example.employeeapp.exception.DepartmentNotFoundException;
import com.example.employeeapp.exception.EmailAlreadyExistsException;
import com.example.employeeapp.exception.EmployeeNotFoundException;
import com.example.employeeapp.repository.DepartmentRepository;
import com.example.employeeapp.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public EmployeeResponse create(EmployeeRequest request) {

        Department department = findDepartmentOrThrow(request.getDepartmentId());

        Employee employee = new Employee();

        applyRequest(employee, request, department);

        Employee saved = employeeRepository.save(employee);

        return toResponse(saved);
    }

    public Employee register(RegisterRequest request) {

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        Department department = findDepartmentOrThrow(request.getDepartmentId());

        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setJoiningDate(LocalDate.now());
        employee.setRole(Role.EMPLOYEE);
        employee.setStatus(EmployeeStatus.ACTIVE);
        employee.setLeaveBalance(12);
        employee.setDepartment(department);

        return employeeRepository.save(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {

        Employee employee = findEmployeeOrThrow(id);

        return toResponse(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAll() {

        return employeeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public EmployeeResponse update(Long id, EmployeeRequest request) {

        Employee employee = findEmployeeOrThrow(id);

        Department department = findDepartmentOrThrow(request.getDepartmentId());

        applyRequest(employee, request, department);

        Employee updated = employeeRepository.save(employee);

        return toResponse(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Long id) {

        Employee employee = findEmployeeOrThrow(id);

        employeeRepository.delete(employee);
    }

    private void applyRequest(
            Employee employee,
            EmployeeRequest request,
            Department department) {

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setRole(request.getRole());
        employee.setStatus(request.getStatus());
        employee.setLeaveBalance(request.getLeaveBalance());
        employee.setDepartment(department);
    }

    private Employee findEmployeeOrThrow(Long id) {

        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(
                        "Employee not found with id: " + id));
    }

    private Department findDepartmentOrThrow(Long departmentId) {

        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new DepartmentNotFoundException(
                        "Department not found with id: " + departmentId));
    }

    private EmployeeResponse toResponse(Employee employee) {

        Department department = employee.getDepartment();

        return EmployeeResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .designation(employee.getDesignation())
                .joiningDate(employee.getJoiningDate())
                .role(employee.getRole())
                .status(employee.getStatus())
                .leaveBalance(employee.getLeaveBalance())
                .departmentId(department != null ? department.getId() : null)
                .departmentName(department != null ? department.getName() : null)
                .build();
    }
}