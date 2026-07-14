package co.entornosseguros.auth.web.dto;

public record UserSummaryResponse(
    Long id,
    String email,
    String fullName,
    String role
) {
}
