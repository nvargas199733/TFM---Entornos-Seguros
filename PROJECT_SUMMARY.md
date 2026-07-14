# Resumen Ejecutivo del Proyecto

## Objetivo

Plataforma para registro y seguimiento de incidentes ciudadanos, con atencion policial y administracion institucional, basada en arquitectura de microservicios.

## Arquitectura funcional

1. auth-user-service
- autenticacion, usuarios y roles.

2. incident-service
- reporte ciudadano, clasificacion, estado y trazabilidad.

3. police-report-service
- atencion formal policial y cierre operativo del caso.

## Estado actual

- Frontend activo en React + Vite.
- Integracion backend orientada por servicios y contratos API.
- Persistencia con PostgreSQL usando schema per service.

## Stack final

- Frontend: React, Vite, React Router, TypeScript (migracion progresiva).
- Backend: Java 17+, Spring Boot, Spring Security JWT, Spring Data JPA, Gradle.
- Datos: PostgreSQL, Redis.
- Operacion: Docker, Docker Compose.

## Criterios de calidad

- Bajo acoplamiento entre dominios.
- Contratos API versionados.
- Trazabilidad de incidentes y atenciones.
- Evolucion incremental sin romper experiencia visual.