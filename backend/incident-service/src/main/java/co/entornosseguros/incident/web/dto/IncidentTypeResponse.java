package co.entornosseguros.incident.web.dto;

public record IncidentTypeResponse(
    Long idTipoIncidente,
    String nombre,
    String descripcion,
    Boolean estadoActivo
) {
}
