package com.example.ecomm.service.exception;

/**
 * Indicates a conflict with existing state (e.g. duplicate paymentIntent).
 * Controller maps this to HTTP 409.
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
