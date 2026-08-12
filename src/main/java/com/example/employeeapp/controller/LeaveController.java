package com.example.employeeapp.controller;

import com.example.employeeapp.dto.LeaveApplicationRequest;
import com.example.employeeapp.dto.LeaveApplicationResponse;
import com.example.employeeapp.dto.LeaveDecisionRequest;
import com.example.employeeapp.entity.LeaveStatus;
import com.example.employeeapp.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/api/employees/{employeeId}/leaves")
    public ResponseEntity<LeaveApplicationResponse> apply(@PathVariable Long employeeId,
            @Valid @RequestBody LeaveApplicationRequest request) {
        LeaveApplicationResponse response = leaveService.apply(employeeId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/employees/{employeeId}/leaves")
    public ResponseEntity<List<LeaveApplicationResponse>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getByEmployee(employeeId));
    }

    @GetMapping("/api/manager/leaves")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<List<LeaveApplicationResponse>> getAll(
            @RequestParam(required = false) LeaveStatus status) {
        return ResponseEntity.ok(status != null
                ? leaveService.getByStatus(status)
                : leaveService.getAll());
    }

    @PostMapping("/api/manager/leaves/{leaveId}/approve")
    public ResponseEntity<LeaveApplicationResponse> approve(@PathVariable Long leaveId) {
        return ResponseEntity.ok(leaveService.approve(leaveId));
    }

    @PostMapping("/api/manager/leaves/{leaveId}/reject")
    public ResponseEntity<LeaveApplicationResponse> reject(@PathVariable Long leaveId,
            @Valid @RequestBody LeaveDecisionRequest request) {
        return ResponseEntity.ok(leaveService.reject(leaveId, request));
    }
}
