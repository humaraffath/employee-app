package com.example.employeeapp.service;

import com.example.employeeapp.dto.LeaveApplicationRequest;
import com.example.employeeapp.dto.LeaveApplicationResponse;
import com.example.employeeapp.dto.LeaveDecisionRequest;
import com.example.employeeapp.entity.Employee;
import com.example.employeeapp.entity.LeaveApplication;
import com.example.employeeapp.entity.LeaveStatus;
import com.example.employeeapp.exception.EmployeeNotFoundException;
import com.example.employeeapp.exception.InsufficientLeaveBalanceException;
import com.example.employeeapp.exception.InvalidLeaveRequestException;
import com.example.employeeapp.exception.LeaveApplicationNotFoundException;
import com.example.employeeapp.repository.EmployeeRepository;
import com.example.employeeapp.repository.LeaveApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveService {

    private final EmployeeRepository employeeRepository;
    private final LeaveApplicationRepository leaveApplicationRepository;

    public LeaveApplicationResponse apply(Long employeeId, LeaveApplicationRequest request) {
        Employee employee = findEmployeeOrThrow(employeeId);

        validateDateRange(request.getStartDate(), request.getEndDate());
        long duration = calculateDuration(request.getStartDate(), request.getEndDate());
        validateSufficientBalance(employee, duration);

        LeaveApplication leaveApplication = new LeaveApplication();
        leaveApplication.setEmployee(employee);
        leaveApplication.setLeaveType(request.getLeaveType());
        leaveApplication.setStartDate(request.getStartDate());
        leaveApplication.setEndDate(request.getEndDate());
        leaveApplication.setReason(request.getReason());
        leaveApplication.setStatus(LeaveStatus.PENDING);
        leaveApplication.setSubmittedAt(LocalDateTime.now());

        LeaveApplication saved = leaveApplicationRepository.save(leaveApplication);
        return toResponse(saved);
    }

    @Transactional
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public LeaveApplicationResponse approve(Long leaveApplicationId) {
        LeaveApplication leaveApplication = findLeaveApplicationOrThrow(leaveApplicationId);
        validatePending(leaveApplication);

        Employee employee = leaveApplication.getEmployee();
        long duration = calculateDuration(leaveApplication.getStartDate(), leaveApplication.getEndDate());
        validateSufficientBalance(employee, duration);

        employee.setLeaveBalance(employee.getLeaveBalance() - (int) duration);
        employeeRepository.save(employee);

        leaveApplication.setStatus(LeaveStatus.APPROVED);
        LeaveApplication updated = leaveApplicationRepository.save(leaveApplication);
        return toResponse(updated);
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public LeaveApplicationResponse reject(Long leaveApplicationId, LeaveDecisionRequest request) {
        LeaveApplication leaveApplication = findLeaveApplicationOrThrow(leaveApplicationId);
        validatePending(leaveApplication);

        if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
            throw new InvalidLeaveRequestException("Rejection reason is required");
        }

        leaveApplication.setStatus(LeaveStatus.REJECTED);
        leaveApplication.setRejectionReason(request.getRejectionReason());

        LeaveApplication updated = leaveApplicationRepository.save(leaveApplication);
        return toResponse(updated);
    }

    @Transactional(readOnly = true)
    public LeaveApplicationResponse getById(Long id) {
        return toResponse(findLeaveApplicationOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<LeaveApplicationResponse> getAll() {
        return leaveApplicationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeaveApplicationResponse> getByEmployee(Long employeeId) {
        return leaveApplicationRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeaveApplicationResponse> getByStatus(LeaveStatus status) {
        return leaveApplicationRepository.findByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new InvalidLeaveRequestException("Start date cannot be after end date");
        }
    }

    private void validateSufficientBalance(Employee employee, long duration) {
        if (employee.getLeaveBalance() < duration) {
            throw new InsufficientLeaveBalanceException(
                    "Insufficient leave balance. Available: " + employee.getLeaveBalance()
                            + ", Required: " + duration);
        }
    }

    private void validatePending(LeaveApplication leaveApplication) {
        if (leaveApplication.getStatus() != LeaveStatus.PENDING) {
            throw new InvalidLeaveRequestException("Only pending leave applications can be approved or rejected");
        }
    }

    private long calculateDuration(LocalDate startDate, LocalDate endDate) {
        return ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }

    private Employee findEmployeeOrThrow(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + employeeId));
    }

    private LeaveApplication findLeaveApplicationOrThrow(Long id) {
        return leaveApplicationRepository.findById(id)
                .orElseThrow(() -> new LeaveApplicationNotFoundException("Leave application not found with id: " + id));
    }

    private LeaveApplicationResponse toResponse(LeaveApplication leaveApplication) {
        Employee employee = leaveApplication.getEmployee();
        return LeaveApplicationResponse.builder()
                .id(leaveApplication.getId())
                .employeeId(employee != null ? employee.getId() : null)
                .employeeName(employee != null ? employee.getName() : null)
                .leaveType(leaveApplication.getLeaveType())
                .startDate(leaveApplication.getStartDate())
                .endDate(leaveApplication.getEndDate())
                .reason(leaveApplication.getReason())
                .status(leaveApplication.getStatus())
                .submittedAt(leaveApplication.getSubmittedAt())
                .rejectionReason(leaveApplication.getRejectionReason())
                .build();
    }
}
