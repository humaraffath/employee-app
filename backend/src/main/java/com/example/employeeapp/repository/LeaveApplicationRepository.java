package com.example.employeeapp.repository;

import com.example.employeeapp.entity.LeaveApplication;
import com.example.employeeapp.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {

    List<LeaveApplication> findByEmployeeId(Long employeeId);

    List<LeaveApplication> findByStatus(LeaveStatus status);

    List<LeaveApplication> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);
}
