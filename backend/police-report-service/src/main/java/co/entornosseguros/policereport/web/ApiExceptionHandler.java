package co.entornosseguros.policereport.web;

import java.time.OffsetDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.HttpMediaTypeNotSupportedException;

import jakarta.servlet.http.HttpServletRequest;
import co.entornosseguros.policereport.service.PoliceReportConflictException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> details = ex.getBindingResult().getFieldErrors().stream()
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
            "details", details,
            "path", request.getRequestURI()
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBusiness(IllegalArgumentException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
            "timestamp", OffsetDateTime.now().toString(),
            "status", 400,
            "error", "Bad Request",
            "message", ex.getMessage(),
            "path", request.getRequestURI()
        ));
    }

    @ExceptionHandler(PoliceReportConflictException.class)
    public ResponseEntity<?> handleConflict(PoliceReportConflictException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
            "timestamp", OffsetDateTime.now().toString(),
            "status", 409,
            "error", "Conflict",
            "message", ex.getMessage(),
            "path", request.getRequestURI()
        ));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<?> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(Map.of(
            "timestamp", OffsetDateTime.now().toString(),
            "status", 415,
            "error", "Unsupported Media Type",
            "message", "El formato enviado al servicio de informes no es válido.",
            "path", request.getRequestURI()
        ));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
            "timestamp", OffsetDateTime.now().toString(),
            "status", 500,
            "error", "Internal Server Error",
            "message", "No fue posible guardar el informe policial.",
            "path", request.getRequestURI()
        ));
    }
}