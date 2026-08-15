package co.entornosseguros.incident.service;

public class IncidentNotFoundException extends RuntimeException {

    public IncidentNotFoundException(String message) {
        super(message);
    }
}