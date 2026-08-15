package co.entornosseguros.policereport.security;

public record AuthenticatedUser(
    Long id,
    String email,
    String role
) {
}