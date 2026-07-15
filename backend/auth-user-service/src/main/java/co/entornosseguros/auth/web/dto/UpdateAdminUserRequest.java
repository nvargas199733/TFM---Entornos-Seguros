package co.entornosseguros.auth.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateAdminUserRequest(
    @NotBlank @Size(max = 20) String cedula,
    @NotBlank @Size(min = 3, max = 200) String fullName,
    @NotBlank @Pattern(regexp = "^[0-9]{7,15}$") String telefono,
    @NotBlank @Email @Size(max = 120) String email,
    @NotBlank @Size(min = 3, max = 50) String role,
    @NotBlank @Size(min = 8, max = 100) String password
) {
}
