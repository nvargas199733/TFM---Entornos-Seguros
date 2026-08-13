# Microservicios: Información validada y endpoints

Este documento recolecta la información validada del repositorio y la lista actual de endpoints expuestos por los tres microservicios del proyecto "Entornos Seguros".

---

## Resumen validado (estado actual)

- Plataforma backend: Java 21, Spring Boot (módulos Gradle por microservicio).
- Persistencia: PostgreSQL. Estrategia: schema-per-service.
- Modo de bootstrap: `spring.jpa.hibernate.ddl-auto: update` y `create_namespaces: true` en configuración para facilitar arranque local.
- Autenticación: `auth-user-service` emite JWT; frontends guardan sesión en `localStorage` bajo la clave `entornos_auth`.
- CAI (Centros de Atención Inmediata): catálogo de referencia alojado en `auth_user.cai` y expuesto por `auth-user-service` (decisión: Opción 1, excepción controlada).

---

## 1) auth-user-service

Base URL (por defecto local): `http://localhost:8081`
Schema DB: `auth_user`
Puerto por defecto: `8081`

Descripción breve: Maneja autenticación, usuarios/administradores y el catálogo CAI (solo lectura). Emite tokens JWT que protegen endpoints cuando aplica.

Endpoints principales

- `GET /api/v1/auth/health`
  - Estado del servicio.
  - Response: `{ "service": "auth-user-service", "status": "UP" }`

- `POST /api/v1/auth/register`
  - Registra usuario ciudadano y devuelve `AuthResponse` (token + user summary).
  - Request body (`RegisterRequest`):
    ```json
    {
      "cedula": "12345678",
      "nombres": "Juan Pablo",
      "apellidos": "Perez",
      "telefono": "3001234567",
      "email": "juan@example.com",
      "password": "********"
    }
    ```
  - Response: `AuthResponse` → `{ token, tokenType, user }`

- `POST /api/v1/auth/login`
  - Login con email+password. Devuelve `AuthResponse`.
  - Request body (`LoginRequest`): `{ "email": "juan@example.com", "password": "..." }`

- `GET /api/v1/auth/me`
  - Devuelve información del usuario autenticado (`UserSummaryResponse`). Requiere autorización con `Authorization: Bearer <token>`.

- `GET /api/v1/users` (admin)
  - Listar usuarios activos (admin area).

- `GET /api/v1/users/{id}` (admin)
  - Obtener usuario por id.

- `POST /api/v1/users` (admin)
  - Crear usuario administrativo (`CreateAdminUserRequest`).

- `PUT /api/v1/users/{id}` (admin)
  - Actualizar usuario administrativo.

- `DELETE /api/v1/users/{id}` (admin)
  - Desactivar usuario.

- CAI (catálogo)
  - `GET /api/v1/cai` → Listar CAI activos
  - `GET /api/v1/cai/{id}` → Obtener CAI por id
  - `GET /api/v1/cai/nearest?lat=<lat>&lng=<lng>` → CAI más cercano (usa columna `geom` / PostGIS)

Notas de integración

- Los frontends ya consumen estos endpoints: `register`, `login`, `me`, y el mapa usa `GET /api/v1/cai`.
- Respuestas siguen DTOs en `backend/auth-user-service/src/main/java/co/entornosseguros/auth/web/dto`.

---

## 2) incident-service

Base URL (por defecto local): `http://localhost:8082`
Schema DB: `incident`
Puerto por defecto: `8082`

Descripción breve: Creación y gestión de incidentes ciudadanos, evidencias y historial de estado. Expone catálogos de tipos y estados.

Endpoints principales

- `GET /api/v1/incidents/health`
  - Estado del servicio.
  - Response: `{ "service":"incident-service","status":"UP" }`

- `GET /api/v1/incidents` 
  - Listar incidentes. Query param opcional: `idUsuario` para filtrar por autor.
  - Ejemplo: `/api/v1/incidents?idUsuario=12`

- `POST /api/v1/incidents` (CreateIncidentRequest)
  - Crear incidente. Request body:
    ```json
    {
      "idUsuario": 12,
      "idTipoIncidente": 1,
      "descripcion": "Descripción...",
      "latitud": 4.711,
      "longitud": -74.072,
      "direccionReferencia": "Av. ejemplo"
    }
    ```
  - Respuesta: `IncidentResponse` con campos normalizados (idIncidente, tipo, estado, timestamps, coordenadas).

- `GET /api/v1/incidents/{id}`
  - Obtener incidente por id.

- `GET /api/v1/incidents/{id}/history`
  - Obtener historial de estados del incidente.

- `POST /api/v1/incidents/{id}/evidences` (CreateEvidenceRequest)
  - Agregar evidencia a incidente. Request body:
    ```json
    {
      "tipoArchivo": "imagen",
      "urlArchivo": "https://...",
      "nombreArchivo": "foto.jpg"
    }
    ```

- `PATCH /api/v1/incidents/{id}/status` (ChangeIncidentStatusRequest)
  - Cambiar estado del incidente (usado por administración/policía). Request body:
    ```json
    {
      "idEstadoIncidente": 2,
      "idUsuarioResponsable": 45,
      "observacion": "Asignado a patrulla"
    }
    ```

- `GET /api/v1/incidents/catalogs/types`
  - Obtener lista de tipos de incidente (catalogo). DTO: `IncidentTypeResponse`.

- `GET /api/v1/incidents/catalogs/statuses`
  - Obtener lista de estados de incidente (catalogo).

Notas de integración

- DTOs relevantes se encuentran en `backend/incident-service/src/main/java/co/entornosseguros/incident/web/dto`.
- El servicio incluye un `CommandLineRunner` (`IncidentCatalogBootstrap`) que inicializa tipos y estados si la tabla está vacía.
- Se validó y corregió manejo de timestamps en `IncidentTypeEntity` para evitar errores `NOT NULL` en `created_at/updated_at`.

---

## 3) police-report-service

Base URL (por defecto local): `http://localhost:8083`
Schema DB: `police_report`
Puerto por defecto: `8083`

Descripción breve: Formalización de reportes policiales (cuando la policía cierra la atención de un incidente). Guarda reporte policial ligado al incidente.

Endpoints principales

- `GET /api/v1/police-reports/health`
  - Estado del servicio.
  - Response: `{ "service":"police-report-service","status":"UP" }`

- `POST /api/v1/police-reports` (CreatePoliceReportRequest)
  - Crear reporte policial. Request body:
    ```json
    {
      "idIncidente": 123,
      "idUsuarioPolicia": 45,
      "huboHeridos": false,
      "descripcionAtencion": "Descripción detallada de la atención"
    }
    ```

- `GET /api/v1/police-reports/{id}`
  - Obtener reporte policial por id.

- `GET /api/v1/police-reports/by-incident/{idIncidente}`
  - Obtener reportes policiales relacionados a un `idIncidente`.

Notas de integración

- `police-report-service` está diseñado para usarse tras la atención; integra con `incident-service` vía identificadores lógicos (no hay foreign key cross-schema directa en la aplicación).

---

## Ejemplos rápidos (curl)

- Registrar usuario (auth):

```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"cedula":"12345678","nombres":"Juan","apellidos":"Perez","telefono":"3001234567","email":"juan@example.com","password":"secret123"}'
```

- Crear incidente (incident):

```bash
curl -X POST http://localhost:8082/api/v1/incidents \
  -H 'Content-Type: application/json' \
  -d '{"idUsuario":1,"idTipoIncidente":1,"descripcion":"Prueba","latitud":4.711,"longitud":-74.072,"direccionReferencia":"Calle X"}'
```

- Listar CAI (auth):

```bash
curl http://localhost:8081/api/v1/cai
```

---

## Notas operacionales y próximos pasos

- Pruebas runtime: para validar end-to-end levantar PostgreSQL (docker-compose), iniciar los microservicios y usar los endpoints anteriores.
- Se recomienda agregar migraciones (Flyway/Liquibase) para evitar dependencia de `ddl-auto:update` en entornos no-desarrollo.
- Verificar CORS si front y back quedan en dominios/puertos distintos.

---

Archivo generado automáticamente desde el código fuente del repositorio: `docs/MICROSERVICES_ENDPOINTS.md`

Última verificación: código en ramas locales del workspace (compilaciones y correcciones recientes aplicadas). 
