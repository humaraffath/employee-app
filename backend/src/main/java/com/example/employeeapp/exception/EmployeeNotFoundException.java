package com.example.employeeapp.exception;

/**
 * Thrown when an Employee cannot be found by its identifier.
 */
public class EmployeeNotFoundException extends RuntimeException {

    public EmployeeNotFoundException(String message) {
        super(message);
    }
}
