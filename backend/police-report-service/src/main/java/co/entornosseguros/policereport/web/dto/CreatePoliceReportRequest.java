package co.entornosseguros.policereport.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreatePoliceReportRequest(
    @NotNull Long idIncidente,
    @NotNull Long idUsuarioPolicia,
    @NotNull Boolean huboHeridos,
    @NotBlank @Size(max = 4000) String descripcionAtencion
) {
}