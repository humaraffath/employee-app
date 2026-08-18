package com.example.employeeapp.exception;

/**
 * Thrown when a leave application request or decision violates a business rule,
 * e.g. an invalid date range or an unsupported state transition.
 */
public class InvalidLeaveRequestException extends RuntimeException {

    public InvalidLeaveRequestException(String message) {
        super(message);
    }
}
