# Backend Monorepo (Java + Gradle)

Este directorio contiene los tres microservicios del backend definidos para el TFM:

- auth-user-service
- incident-service
- police-report-service

## Requisitos

- Java 21+
- Gradle 8+
- PostgreSQL (mismo motor con esquema por servicio)

## Estructura

- backend/settings.gradle: registro de subproyectos
- backend/build.gradle: configuracion comun
- backend/auth-user-service
- backend/incident-service
- backend/police-report-service

## Ejecutar un microservicio

Desde la carpeta backend:

```bash
gradle :auth-user-service:bootRun
gradle :incident-service:bootRun
gradle :police-report-service:bootRun
```

## Puertos por defecto

- auth-user-service: 8081
- incident-service: 8082
- police-report-service: 8083

## Health checks basicos

- GET /api/v1/auth/health
- GET /api/v1/incidents/health
- GET /api/v1/police-reports/health

Tambien esta disponible Spring Actuator:

- GET /actuator/health
