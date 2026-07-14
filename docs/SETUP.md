# Guia de Setup

## Requisitos

- Node.js 20+
- npm 10+
- Java 17+
- Gradle 8+
- Docker y Docker Compose

## 1) Levantar infraestructura

Desde la raiz del proyecto:

```bash
docker compose up -d
```

Servicios esperados:
- PostgreSQL en 5432
- Redis en 6379
- PgAdmin en 5050

## 2) Ejecutar frontends

### Ciudadano

```bash
cd ciudadano
npm install
npm run dev
```

### Policia/Admin

```bash
cd frontend-react
npm install
npm run dev
```

## 3) Ejecutar backend (microservicios)

Ejemplo por servicio:

```bash
cd backend/auth-user-service
./gradlew bootRun
```

Repetir para:
- backend/incident-service
- backend/police-report-service

## 4) Variables de entorno recomendadas

Backend:
- DB host, puerto, usuario y password
- JWT secret y expiracion
- CORS allowed origins

Frontend:
- URL base por microservicio
- flags de entorno dev/prod

## 5) Verificacion rapida

- Front ciudadano y policia levantan sin errores de build.
- Los tres microservicios responden healthcheck.
- El login permite obtener token JWT.