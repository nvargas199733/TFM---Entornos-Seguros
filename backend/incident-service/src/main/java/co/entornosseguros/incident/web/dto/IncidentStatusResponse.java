package co.entornosseguros.incident.web.dto;

public record IncidentStatusResponse(
    Long idEstadoIncidente,
    String nombre,
    String descripcion
) {
}
