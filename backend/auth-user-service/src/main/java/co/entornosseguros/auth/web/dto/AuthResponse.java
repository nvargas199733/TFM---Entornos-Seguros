package co.entornosseguros.auth.web.dto;

public record AuthResponse(
    String token,
    String tokenType,
    UserSummaryResponse user
) {
}
