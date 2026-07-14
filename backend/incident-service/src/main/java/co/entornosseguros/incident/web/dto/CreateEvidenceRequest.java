package co.entornosseguros.incident.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateEvidenceRequest(
    @NotBlank @Size(max = 30) String tipoArchivo,
    @NotBlank @Size(max = 255) String urlArchivo,
    @NotBlank @Size(max = 150) String nombreArchivo
) {
}
