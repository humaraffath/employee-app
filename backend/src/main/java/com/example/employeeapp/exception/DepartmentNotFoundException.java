package com.example.employeeapp.exception;

/**
 * Thrown when a Department cannot be found by its identifier.
 */
public class DepartmentNotFoundException extends RuntimeException {

    public DepartmentNotFoundException(String message) {
        super(message);
    }
}
