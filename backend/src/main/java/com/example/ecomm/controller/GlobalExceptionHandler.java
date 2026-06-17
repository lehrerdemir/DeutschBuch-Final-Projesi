package com.example.ecomm.controller;

import com.example.ecomm.api.ApiError;
import com.example.ecomm.service.exception.BadRequestException;
import com.example.ecomm.service.exception.ConflictException;
import com.example.ecomm.service.exception.NotFoundException;
import com.stripe.exception.StripeException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Central HTTP mapping for service-layer exceptions.
 * Keeps controllers thin and avoids repeating try/catch everywhere.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> notFound(NotFoundException e, HttpServletRequest req) {
        return ResponseEntity.status(404)
                .body(ApiError.of(404, "Not Found", e.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> badRequest(BadRequestException e, HttpServletRequest req) {
        return ResponseEntity.badRequest()
                .body(ApiError.of(400, "Bad Request", e.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> conflict(ConflictException e, HttpServletRequest req) {
        return ResponseEntity.status(409)
                .body(ApiError.of(409, "Conflict", e.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> serverMisconfigured(IllegalStateException e, HttpServletRequest req) {
        // e.g., missing stripe.secret-key
        return ResponseEntity.status(500)
                .body(ApiError.of(500, "Internal Server Error", e.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> validation(MethodArgumentNotValidException e, HttpServletRequest req) {
        Map<String, String> fieldErrors = e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fe -> fe.getDefaultMessage() == null ? "Invalid value" : fe.getDefaultMessage(),
                        (a, b) -> a,
                        LinkedHashMap::new
                ));

        return ResponseEntity.badRequest()
                .body(ApiError.of(400, "Bad Request", "Validation failed", req.getRequestURI(), fieldErrors));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> notReadable(HttpMessageNotReadableException e, HttpServletRequest req) {
        return ResponseEntity.badRequest()
                .body(ApiError.of(400, "Bad Request", "Malformed JSON request", req.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> typeMismatch(MethodArgumentTypeMismatchException e, HttpServletRequest req) {
        String msg = "Invalid value for parameter: " + e.getName();
        return ResponseEntity.badRequest()
                .body(ApiError.of(400, "Bad Request", msg, req.getRequestURI()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> responseStatus(ResponseStatusException e, HttpServletRequest req) {
        int status = e.getStatusCode().value();
        String err = e.getStatusCode().toString();
        String msg = e.getReason() != null ? e.getReason() : err;
        return ResponseEntity.status(status)
                .body(ApiError.of(status, err, msg, req.getRequestURI()));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ApiError> io(IOException e, HttpServletRequest req) {
        return ResponseEntity.badRequest()
                .body(ApiError.of(400, "Bad Request", e.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(StripeException.class)
    public ResponseEntity<ApiError> stripe(StripeException e, HttpServletRequest req) {
        // Don't leak too much provider detail; give a user-friendly message.
        return ResponseEntity.status(502)
                .body(ApiError.of(502, "Bad Gateway", "Payment provider error", req.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> generic(Exception e, HttpServletRequest req) {
        return ResponseEntity.status(500)
                .body(ApiError.of(500, "Internal Server Error", "Unexpected server error", req.getRequestURI()));
    }
}
