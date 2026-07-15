package co.entornosseguros.policereport.web.dto;

import java.time.OffsetDateTime;

public record PoliceReportResponse(
    Long idReportePolicial,
    Long idIncidente,
    Long idUsuarioPolicia,
    Boolean huboHeridos,
    String descripcionAtencion,
    OffsetDateTime fechaReporte,
    OffsetDateTime fechaActualizacion
) {
}