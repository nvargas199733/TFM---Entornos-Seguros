package co.entornosseguros.incident.web.dto;

import java.time.OffsetDateTime;

public record IncidentStatusHistoryResponse(
    Long idHistorial,
    Long idIncidente,
    Long idEstadoIncidente,
    String estadoIncidente,
    Long idUsuarioResponsable,
    String observacion,
    OffsetDateTime fechaCambio
) {
}
