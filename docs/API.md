# API Contract (Estado Actual)

Este documento refleja los endpoints implementados hoy en backend y su consumo desde los frontends actuales.

## Convenciones

- Formato: JSON
- Versionado: /api/v1
- Seguridad y pruebas: se documentan en una fase posterior

## auth-user-service

Base: /api/v1/auth, /api/v1/users y /api/v1/cai

### Endpoints implementados

- POST /api/v1/auth/login
- POST /api/v1/auth/register
- GET /api/v1/auth/me
- GET /api/v1/users
- GET /api/v1/users/{id}
- POST /api/v1/users
- PUT /api/v1/users/{id}
- DELETE /api/v1/users/{id}
- GET /api/v1/cai
- GET /api/v1/cai/{id}
- GET /api/v1/cai/nearest?lat={lat}&lng={lng}

## incident-service

Base: /api/v1/incidents

### Endpoints implementados

- GET /api/v1/incidents
- GET /api/v1/incidents?idUsuario={id}
- POST /api/v1/incidents
- GET /api/v1/incidents/{id}
- GET /api/v1/incidents/{id}/history
- POST /api/v1/incidents/{id}/evidences
- PATCH /api/v1/incidents/{id}/status
- GET /api/v1/incidents/catalogs/types
- GET /api/v1/incidents/catalogs/statuses

## police-report-service

Base: /api/v1/police-reports

### Endpoints implementados

- POST /api/v1/police-reports
- GET /api/v1/police-reports/{id}
- GET /api/v1/police-reports/by-incident/{idIncidente}

## Cobertura Frontend-Backend

### frontend-ciudadano

- Login y registro: conectado con auth-user-service
- Perfil de sesion (me): conectado con auth-user-service
- Reporte ciudadano (crear incidente): conectado con incident-service
- Evidencias por URL: conectado con incident-service
- Mis reportes y detalle: conectado con incident-service
- Historial de estados: conectado con incident-service
- Catalogo de tipos de incidente: conectado con incident-service
- CAI y CAI mas cercano: conectado con auth-user-service

### frontend-policia-admin

- Bandeja de reportes y detalle de incidente: conectado con incident-service
- Generacion de informe policial: conectado con police-report-service
- Cambio de estado de incidente a atendido: conectado con incident-service
- Gestion de usuarios admin (listar, crear, editar, eliminar logico): conectado con auth-user-service

## Brechas Funcionales Detectadas (Sin Seguridad/Pruebas)

1. Personas buscadas en Home Police/Admin se alimenta de datos locales y no tiene microservicio dedicado.
2. Identidad del policia en formularios y detalle usa datos mock (currentPoliceData), no viene de un endpoint del backend dentro de ese frontend.
3. La vista de tipos de reporte ciudadano usa una lista fija en frontend; depende de coincidencia de nombres con el catalogo real de incidentes.
4. En docs anteriores existia refresh-token como endpoint sugerido, pero hoy no esta implementado.

## Errores de API (formato actual)

```json
{
  "timestamp": "2026-07-15T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/incidents",
  "details": {
    "campo": "mensaje de validacion"
  }
}
```