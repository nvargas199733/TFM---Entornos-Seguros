# API Contract (Resumen)

Este documento resume los endpoints principales por microservicio.

## Convenciones

- Formato: JSON
- Autenticacion: Bearer JWT
- Versionado recomendado: /api/v1

## auth-user-service

Base sugerida: /api/v1/auth y /api/v1/users

### Endpoints

- POST /auth/login
- POST /auth/register
- POST /auth/refresh-token
- GET /users/me
- GET /users
- POST /users
- PUT /users/{id}

### Login request

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

### Login response

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "CITIZEN"
  }
}
```

## incident-service

Base sugerida: /api/v1/incidents

### Endpoints

- GET /incidents
- POST /incidents
- GET /incidents/{id}
- PUT /incidents/{id}
- GET /incidents/{id}/history
- POST /incidents/{id}/evidences

### Incident create request

```json
{
  "idUsuario": 12,
  "idTipoIncidente": 2,
  "descripcion": "Robo en via publica",
  "latitud": -2.170,
  "longitud": -79.922,
  "direccionReferencia": "Av. principal"
}
```

## police-report-service

Base sugerida: /api/v1/police-reports

### Endpoints

- POST /police-reports
- GET /police-reports/{id}
- GET /police-reports/by-incident/{idIncidente}

### Police report request

```json
{
  "idIncidente": 40,
  "idUsuarioPolicia": 7,
  "huboHeridos": true,
  "descripcionAtencion": "Se asistio a victima y se notifico al fiscal"
}
```

## Errores estandar

```json
{
  "timestamp": "2026-07-14T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/incidents"
}
```