package co.entornosseguros.incident.web.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateIncidentRequest(
    @NotNull Long idUsuario,
    @NotNull Long idTipoIncidente,
    @NotBlank @Size(max = 2000) String descripcion,
    @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0") BigDecimal latitud,
    @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0") BigDecimal longitud,
    @Size(max = 295) String direccionReferencia
) {
}
