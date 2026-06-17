package com.example.ecomm.api;

import java.time.Instant;

/**
 * Standard error payload returned by the backend.
 *
 * Frontend should display the {@code message} field.
 */
public record ApiError(
        String timestamp,
        int status,
        String error,
        String message,
        String path,
        Object details
) {

    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(Instant.now().toString(), status, error, message, path, null);
    }

    public static ApiError of(int status, String error, String message, String path, Object details) {
        return new ApiError(Instant.now().toString(), status, error, message, path, details);
    }
}
