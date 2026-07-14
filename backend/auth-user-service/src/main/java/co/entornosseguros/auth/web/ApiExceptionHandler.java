package co.entornosseguros.auth.web;

import java.time.OffsetDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .collect(java.util.stream.Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage,
                (first, second) -> first
            ));

        return ResponseEntity.badRequest().body(Map.of(
            "timestamp", OffsetDateTime.now().toString(),
            "status", 400,
            "error", "Bad Request",
            "message", "Validation failed",
            "details", fieldErrors,
            "path", request.getRequestURI()
        ));
    }

    @ExceptionHandler({IllegalArgumentException.class, BadCredentialsException.class})
    public ResponseEntity<?> handleBusiness(RuntimeException ex, HttpServletRequest request) {
        HttpStatus status = ex instanceof BadCredentialsException ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(status).body(Map.of(
            "timestamp", OffsetDateTime.now().toString(),
            "status", status.value(),
            "error", status.getReasonPhrase(),
            "message", ex.getMessage(),
            "path", request.getRequestURI()
        ));
    }
}
