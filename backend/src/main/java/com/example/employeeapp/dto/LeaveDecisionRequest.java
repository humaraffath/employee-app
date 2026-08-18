package com.example.employeeapp.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveDecisionRequest {

    @Size(max = 255, message = "Rejection reason must not exceed 255 characters")
    private String rejectionReason;
}
