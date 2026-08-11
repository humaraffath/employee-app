package com.example.employeeapp.exception;

/**
 * Thrown when an employee does not have enough leave balance to cover a
 * requested or approved leave application.
 */
public class InsufficientLeaveBalanceException extends RuntimeException {

    public InsufficientLeaveBalanceException(String message) {
        super(message);
    }
}
