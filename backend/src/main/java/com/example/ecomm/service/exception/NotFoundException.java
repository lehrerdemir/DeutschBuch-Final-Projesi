package com.example.ecomm.service.exception;

/**
 * Indicates a requested resource was not found.
 * Controller maps this to HTTP 404.
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
