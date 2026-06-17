package com.example.ecomm.service.exception;

/**
 * Indicates the client provided invalid input or violated a business rule.
 * Controller maps this to HTTP 400.
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
