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
- Integracion backend funcional en los dos frontends, con consumo de endpoints reales por microservicio.
- Persistencia con PostgreSQL usando schema per service.

## Cobertura funcional actual

1. frontend-ciudadano
- Registro, login y consulta de sesion (auth-user-service).
- Creacion de incidentes, evidencia, consulta de historial y estados (incident-service).
- Consulta de CAI y CAI mas cercano (auth-user-service).

2. frontend-policia-admin
- Consulta de incidentes y detalle (incident-service).
- Generacion de reporte policial y cierre operativo (police-report-service + incident-service).
- Gestion de usuarios admin (auth-user-service).

## Brechas funcionales (pendientes)

1. Modulo "personas buscadas" funciona con dataset local (sin microservicio propio).
2. Datos del policia autenticado en el panel policial/admin siguen con mock local.
3. Tipos de reporte en UI ciudadana siguen definidos en frontend (lista fija), no desde catalogo dinamico en esa pantalla.

## Stack final

- Frontend: React, Vite, React Router, TypeScript (migracion progresiva).
- Backend: Java 21+, Spring Boot, Spring Security JWT, Spring Data JPA, Gradle.
- Datos: PostgreSQL, Redis.
- Operacion: Docker, Docker Compose.

## Criterios de calidad

- Bajo acoplamiento entre dominios.
- Contratos API versionados.
- Trazabilidad de incidentes y atenciones.
- Evolucion incremental sin romper experiencia visual.