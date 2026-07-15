package co.entornosseguros.auth.web.dto;

public record CaiResponse(
    Long id,
    String codigo,
    String nombre,
    String direccion,
    String telefono,
    String localidad,
    Double latitud,
    Double longitud,
    Boolean activo
) {
}
