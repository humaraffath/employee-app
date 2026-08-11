package com.example.employeeapp.exception;

/**
 * Thrown when a LeaveApplication cannot be found by its identifier.
 */
public class LeaveApplicationNotFoundException extends RuntimeException {

    public LeaveApplicationNotFoundException(String message) {
        super(message);
    }
}
