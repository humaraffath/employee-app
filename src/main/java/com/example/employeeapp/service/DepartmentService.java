package com.example.employeeapp.service;

import com.example.employeeapp.dto.DepartmentRequest;
import com.example.employeeapp.dto.DepartmentResponse;
import com.example.employeeapp.entity.Department;
import com.example.employeeapp.exception.DepartmentNotFoundException;
import com.example.employeeapp.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentResponse create(DepartmentRequest request) {
        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());

        Department saved = departmentRepository.save(department);
        return toResponse(saved);
    }

    public DepartmentResponse getById(Long id) {
        Department department = findDepartmentOrThrow(id);
        return toResponse(department);
    }

    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = findDepartmentOrThrow(id);
        department.setName(request.getName());
        department.setDescription(request.getDescription());

        Department updated = departmentRepository.save(department);
        return toResponse(updated);
    }

    public void delete(Long id) {
        Department department = findDepartmentOrThrow(id);
        departmentRepository.delete(department);
    }

    private Department findDepartmentOrThrow(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + id));
    }

    private DepartmentResponse toResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .build();
    }
}
