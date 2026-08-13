package co.entornosseguros.incident.security;

public record AuthenticatedUser(
    Long id,
    String email,
    String role
) {
}