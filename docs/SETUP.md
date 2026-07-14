# Guia de Setup

## Requisitos

- Node.js 20+
- npm 10+
- Java 21+
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
cd frontend-ciudadano
npm install
npm run dev
```

### Policia/Admin

```bash
cd frontend-policia-admin
npm install
npm run dev
```

## 3) Ejecutar backend (microservicios)

Desde la carpeta backend:

```bash
gradle :auth-user-service:bootRun
```

Repetir para:
- gradle :incident-service:bootRun
- gradle :police-report-service:bootRun

## 4) Variables de entorno recomendadas

Backend:
- DB host, puerto, usuario y password
- JWT secret y expiracion
- CORS allowed origins

Frontend:
- URL base por microservicio (ejemplo: VITE_AUTH_API_BASE_URL=http://localhost:8081/api/v1/auth)
- flags de entorno dev/prod

## 5) Verificacion rapida

- Front ciudadano y policia levantan sin errores de build.
- Los tres microservicios responden healthcheck.
- El login permite obtener token JWT.