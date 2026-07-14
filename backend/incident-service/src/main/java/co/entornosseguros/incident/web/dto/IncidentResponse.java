package co.entornosseguros.incident.web.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record IncidentResponse(
    Long idIncidente,
    Long idUsuario,
    Long idTipoIncidente,
    String tipoIncidente,
    Long idEstadoIncidente,
    String estadoIncidente,
    String descripcion,
    BigDecimal latitud,
    BigDecimal longitud,
    String direccionReferencia,
    OffsetDateTime fechaReporte,
    OffsetDateTime fechaActualizacion
) {
}
