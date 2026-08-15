package co.entornosseguros.incident.web.dto;

import java.time.OffsetDateTime;

public record EvidenceResponse(
    Long idEvidenciaIncidente,
    Long idIncidente,
    String tipoArchivo,
    String urlArchivo,
    String nombreArchivo,
    OffsetDateTime fechaCarga
) {
}
