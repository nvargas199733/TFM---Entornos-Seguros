package co.entornosseguros.incident.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ChangeIncidentStatusRequest(
    @NotNull Long idEstadoIncidente,
    Long idUsuarioResponsable,
    @NotBlank @Size(max = 255) String observacion
) {
}
