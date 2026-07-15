package co.entornosseguros.auth.web.dto;

import java.time.OffsetDateTime;

public record AdminUserResponse(
    Long id,
    String cedula,
    String fullName,
    String telefono,
    String email,
    String role,
    Boolean activo,
    OffsetDateTime fechaCreacion
) {
}
