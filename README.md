# Entornos Seguros - Plataforma de Reporte Ciudadano

Proyecto academico (TFM) orientado a la gestion de incidentes ciudadanos con integracion entre aplicaciones frontend y backend basado en microservicios.

## Estado del proyecto

- Frontend: implementado en React + Vite (actualmente en JavaScript/JSX).
- Backend: Definido con arquitectura de 3 microservicios en Java (Spring Boot) con Gradle.
- Persistencia objetivo: PostgreSQL con estrategia schema per service.

## Arquitectura objetivo

El backend se divide en tres microservicios con responsabilidades separadas:

1. auth-user-service: autenticacion, usuarios y roles.
2. incident-service: registro, clasificacion, estado y seguimiento de incidentes.
3. police-report-service: registro formal de atencion policial.

### Estrategia de persistencia

- Base de datos: PostgreSQL.
- Enfoque: un esquema por microservicio dentro de una misma instancia.
- Esquemas previstos:
  - auth_user
  - incident
  - police_report

Esto mantiene propiedad de datos por servicio sin elevar innecesariamente la complejidad operativa del TFM.

## Frontends actuales en el repositorio

El workspace contiene dos dominios funcionales principales de UI:

- Ciudadano: flujo de registro/login, reporte, perfil y mapa.
- Policia/Admin: flujo operativo policial, reportes oficiales y gestion administrativa.

Tambien existen carpetas duplicadas/homologas que estan siendo consolidadas durante la evolucion del proyecto.

## Stack final previsto

### Frontend

- React 19
- Vite 8
- React Router
- TypeScript (migracion progresiva desde JSX)
- Recharts (metricas y paneles)
- Leaflet / React-Leaflet (mapas)

### Backend

- Java 21+
- Spring Boot 3+
- Spring Web (REST)
- Spring Security + JWT
- Spring Data JPA
- Gradle

### Datos y plataforma

- PostgreSQL 16
- Redis 7 (cache y soporte operativo)
- Docker + Docker Compose

### Calidad y soporte

- ESLint (frontend)
- Pruebas unitarias e integracion (frontend y backend)
- Documentacion tecnica en carpeta docs

## Estructura base del repositorio (actual)

```text
TFM---Entornos-Seguros/
|- frontend-ciudadano/              # Frontend ciudadano (activo)
|- frontend-policia-admin/          # Frontend policia/admin (activo)
|- backend/                         # Backend monorepo (3 microservicios)
|- docs/                # Documentacion tecnica
|- docker-compose.yml   # Servicios de infraestructura
|- README.md
```

## Ejecucion local del frontend

Cada frontend React se ejecuta de forma independiente.

1. Instalar dependencias:

```bash
cd frontend-ciudadano
npm install
```

o

```bash
cd frontend-policia-admin
npm install
```

2. Iniciar en desarrollo:

```bash
npm run dev
```

## Infraestructura con Docker

La configuracion actual de Docker Compose contempla:

- PostgreSQL
- PgAdmin
- Redis
- Servicio backend (en evolucion; microservicios en carpeta backend)

Comando:

```bash
docker compose up -d
```

## Integracion frontend-backend (estado actual)

La integracion ya esta operativa y se mantiene de forma incremental:

1. auth-user-service
- login, registro, sesion, roles y gestion de usuarios.

2. incident-service
- crear incidente, listar, detalle, evidencia y cambios de estado.

3. police-report-service
- generar y consultar reporte policial asociado a incidente.

### Cobertura actual por frontend

1. frontend-ciudadano
- Login, registro y perfil de sesion.
- Creacion de incidente y carga de evidencia por URL.
- Consulta de mis reportes, detalle e historial.
- Consulta de CAI y CAI mas cercano.

2. frontend-policia-admin
- Listado y detalle de incidentes.
- Creacion de informe policial y cambio de estado del incidente.
- Gestion administrativa de usuarios (CRUD logico).

## Backend monorepo (estado actual)

El backend en Java + Gradle tiene tres microservicios funcionales:

- backend/auth-user-service
- backend/incident-service
- backend/police-report-service

Cada servicio tiene:

- clase principal Spring Boot
- configuracion application.yml
- endpoints de health por dominio
- controladores REST de negocio activos

## Migracion a TypeScript

La migracion de JSX a TypeScript se hara por etapas, empezando por:

- capa de servicios API,
- modelos de datos,
- pantallas de mayor criticidad de negocio.

Este enfoque evita bloqueos y permite integrar backend en paralelo.

## Documentacion complementaria

- docs/API.md
- docs/ARCHITECTURE.md
- docs/SETUP.md
- PROJECT_STRUCTURE.md
- PROJECT_SUMMARY.md

## Licencia

MIT. Ver archivo LICENSE.

Fabricado con ❤️ en Bogotá D.C. - 2026