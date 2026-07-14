package co.entornosseguros.auth.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank @Size(max = 20) String cedula,
    @NotBlank @Size(max = 100) String nombres,
    @NotBlank @Size(max = 100) String apellidos,
    @NotBlank @Pattern(regexp = "^[0-9]{7,15}$") String telefono,
    @NotBlank @Email @Size(max = 120) String email,
    @NotBlank @Size(min = 8, max = 100) String password
) {
}
