package com.example.employeeapp.dto;

import com.example.employeeapp.entity.LeaveStatus;
import com.example.employeeapp.entity.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveApplicationResponse {

    private Long id;

    private Long employeeId;

    private String employeeName;

    private LeaveType leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private LeaveStatus status;

    private LocalDateTime submittedAt;

    private String rejectionReason;
}
