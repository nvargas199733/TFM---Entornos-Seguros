# Especificación de Contratos API REST - Entornos Seguros

Este documento define la especificación técnica de las APIs REST expuestas por los tres microservicios del sistema **Entornos Seguros**, incluyendo esquemas de solicitud/respuesta, autenticación requerida y mapeo con los frontends.

---

## 1. Convenciones Generales

- **Protocolo:** HTTP/1.1 sobre REST
- **Prefijo de Versión:** `/api/v1`
- **Formato de Carga:** `application/json; charset=UTF-8`
- **Cabeceras Obligatorias para Endpoints Protegidos:**
  ```http
  Authorization: Bearer <token_jwt>
  Content-Type: application/json
  Accept: application/json
  ```
- **Esquema de Error Estándar (`ApiErrorResponse`):**
  ```json
  {
    "timestamp": "2026-08-17T18:30:00Z",
    "status": 400,
    "error": "Bad Request",
    "message": "Descripción detallada del error",
    "path": "/api/v1/incidents"
  }
  ```

---

## 2. Microservicio: `auth-user-service`

- **Base URL Local:** `http://localhost:8081`
- **Esquema DB:** `auth_user`

### 2.1. Endpoints de Autenticación & Perfil

#### `POST /api/v1/auth/register`
Registra un nuevo usuario ciudadano con rol `USUARIO`.

- **Acceso:** Público
- **Request Body (`RegisterRequest`):**
  ```json
  {
    "cedula": "1018293847",
    "nombres": "Carlos",
    "apellidos": "Gómez",
    "telefono": "3109876543",
    "email": "carlos.gomez@example.com",
    "password": "PasswordSeguro123!"
  }
  ```
- **Response (201 Created - `AuthResponse`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "tokenType": "Bearer",
    "user": {
      "idUsuario": 1,
      "cedula": "1018293847",
      "nombres": "Carlos",
      "apellidos": "Gómez",
      "email": "carlos.gomez@example.com",
      "telefono": "3109876543",
      "rol": "USUARIO"
    }
  }
  ```

#### `POST /api/v1/auth/login`
Inicia sesión para cualquier rol (`USUARIO`, `POLICIA`, `ADMINISTRADOR`).

- **Acceso:** Público
- **Request Body (`LoginRequest`):**
  ```json
  {
    "email": "carlos.gomez@example.com",
    "password": "PasswordSeguro123!"
  }
  ```
- **Response (200 OK - `AuthResponse`):** *(Misma estructura que registro)*

#### `GET /api/v1/auth/me`
Obtiene los datos del usuario autenticado en base al token JWT.

- **Acceso:** Autenticado (`USUARIO`, `POLICIA`, `ADMINISTRADOR`)
- **Response (200 OK - `UserSummaryResponse`):**
  ```json
  {
    "idUsuario": 1,
    "cedula": "1018293847",
    "nombres": "Carlos",
    "apellidos": "Gómez",
    "email": "carlos.gomez@example.com",
    "telefono": "3109876543",
    "rol": "USUARIO"
  }
  ```

#### `GET /api/v1/auth/health`
Health check del microservicio.

- **Response (200 OK):** `{"service": "auth-user-service", "status": "UP"}`

---

### 2.2. Endpoints de Gestión de Usuarios (Admin)

#### `GET /api/v1/users`
Lista todos los usuarios registrados en el sistema.

- **Acceso:** Exclusivo `ROLE_ADMIN`
- **Response (200 OK - `List<UserSummaryResponse>`):**
  ```json
  [
    {
      "idUsuario": 1,
      "cedula": "1018293847",
      "nombres": "Carlos",
      "apellidos": "Gómez",
      "email": "carlos.gomez@example.com",
      "telefono": "3109876543",
      "rol": "USUARIO",
      "activo": true
    }
  ]
  ```

#### `POST /api/v1/users`
Crea un usuario desde la consola administrativa (permite asignar roles `POLICIA` o `ADMINISTRADOR`).

- **Acceso:** Exclusivo `ROLE_ADMIN`
- **Request Body (`CreateAdminUserRequest`):**
  ```json
  {
    "cedula": "80123456",
    "nombres": "Patrullero Andrés",
    "apellidos": "Rojas",
    "email": "andres.rojas@policia.gov.co",
    "telefono": "3201112233",
    "password": "PoliciaPassword123!",
    "rol": "POLICIA"
  }
  ```
- **Response (201 Created - `UserSummaryResponse`)**

#### `PUT /api/v1/users/{id}`
Actualiza los datos o rol de un usuario existente.

- **Acceso:** Exclusivo `ROLE_ADMIN`
- **Response (200 OK - `UserSummaryResponse`)**

#### `DELETE /api/v1/users/{id}`
Desactiva lógicamente a un usuario (`activo = false`).

- **Acceso:** Exclusivo `ROLE_ADMIN`
- **Response (204 No Content)**

---

### 2.3. Endpoints del Catálogo CAI

#### `GET /api/v1/cai`
Retorna el catálogo completo de 156+ CAIs activos en Bogotá.

- **Acceso:** Público / Autenticado
- **Response (200 OK - `List<CaiResponse>`):**
  ```json
  [
    {
      "id": 1,
      "nombre": "CAI Fontanar del Río",
      "direccion": "Calle 145 # 138A - 10",
      "localidad": "Suba",
      "telefono": "6016854321",
      "fotoUrl": "https://example.com/cai-fontanar.jpg",
      "latitud": 4.7521,
      "longitud": -74.1105,
      "activo": true
    }
  ]
  ```

#### `GET /api/v1/cai/nearest?lat={lat}&lng={lng}`
Calcula y retorna el CAI más cercano a las coordenadas dadas utilizando consultas espaciales (PostGIS `ST_Distance`).

- **Acceso:** Público / Autenticado
- **Response (200 OK - `CaiResponse`)**

---

## 3. Microservicio: `incident-service`

- **Base URL Local:** `http://localhost:8082`
- **Esquema DB:** `incident`

### 3.1. Endpoints de Incidentes

#### `POST /api/v1/incidents`
Crea un nuevo reporte de incidente ciudadano.

- **Acceso:** Autenticado (`USUARIO`, `POLICIA`, `ADMINISTRADOR`)
- **Request Body (`CreateIncidentRequest`):**
  ```json
  {
    "idTipoIncidente": 1,
    "descripcion": "Robo a mano armada en la esquina del parque.",
    "latitud": 4.6243,
    "longitud": -74.0636,
    "direccionReferencia": "Carrera 7 # 45 - 20"
  }
  ```
- **Response (201 Created - `IncidentResponse`):**
  ```json
  {
    "idIncidente": 34,
    "idUsuario": 1,
    "idTipoIncidente": 1,
    "tipoIncidente": "Robo a persona",
    "idEstadoIncidente": 1,
    "estadoIncidente": "PENDIENTE",
    "latitud": 4.6243,
    "longitud": -74.0636,
    "direccionReferencia": "Carrera 7 # 45 - 20",
    "descripcion": "Robo a mano armada en la esquina del parque.",
    "fechaReporte": "2026-08-17T18:40:00Z",
    "fechaActualizacion": "2026-08-17T18:40:00Z"
  }
  ```

#### `GET /api/v1/incidents`
Lista incidentes. Si el usuario es `ROLE_USUARIO`, solo retorna sus propios incidentes. Si es `ROLE_POLICIA` o `ROLE_ADMIN`, lista todos los incidentes del sistema. Soporta query parameter opcional `idUsuario`.

- **Acceso:** Autenticado
- **Response (200 OK - `List<IncidentResponse>`)**

#### `GET /api/v1/incidents/{id}`
Obtiene el detalle completo de un incidente por su ID.

- **Acceso:** Autenticado (el autor del incidente, cualquier policía o admin)
- **Response (200 OK - `IncidentResponse`)**

#### `GET /api/v1/incidents/{id}/history`
Retorna el historial de transiciones de estado del incidente.

- **Acceso:** Autenticado
- **Response (200 OK - `List<IncidentStatusHistoryResponse>`):**
  ```json
  [
    {
      "idHistorialEstadoIncidente": 1,
      "idIncidente": 34,
      "idEstadoIncidente": 1,
      "estadoIncidente": "PENDIENTE",
      "idUsuarioResponsable": 1,
      "observacion": "Creación inicial del reporte",
      "fechaCambio": "2026-08-17T18:40:00Z"
    }
  ]
  ```

#### `PATCH /api/v1/incidents/{id}/status`
Actualiza el estado de un incidente (p. ej. a `ATENDIDO` tras la intervención policial).

- **Acceso:** `ROLE_POLICIA`, `ROLE_ADMIN`
- **Request Body (`ChangeIncidentStatusRequest`):**
  ```json
  {
    "idEstadoIncidente": 3,
    "idUsuarioResponsable": 2,
    "observacion": "Caso atendido por patrulla del cuadrante 14."
  }
  ```
- **Response (200 OK - `IncidentResponse`)**

---

### 3.2. Endpoints de Evidencias

#### `POST /api/v1/incidents/{id}/evidences`
Asocia un enlace de archivo o imagen como evidencia al incidente.

- **Acceso:** Autenticado
- **Request Body (`CreateEvidenceRequest`):**
  ```json
  {
    "tipoArchivo": "imagen",
    "urlArchivo": "https://storage.example.com/evidencias/foto1.jpg",
    "nombreArchivo": "foto_lugar_hechos.jpg"
  }
  ```
- **Response (201 Created - `EvidenceResponse`):**
  ```json
  {
    "idEvidenciaIncidente": 12,
    "idIncidente": 34,
    "tipoArchivo": "imagen",
    "urlArchivo": "https://storage.example.com/evidencias/foto1.jpg",
    "nombreArchivo": "foto_lugar_hechos.jpg",
    "fechaCarga": "2026-08-17T18:42:00Z"
  }
  ```

#### `GET /api/v1/incidents/{id}/evidences`
Lista todas las evidencias cargadas para un incidente específico.

- **Acceso:** Autenticado (`USUARIO` autor, `POLICIA`, `ADMINISTRADOR`)
- **Response (200 OK - `List<EvidenceResponse>`)**

---

### 3.3. Endpoints de Catálogos

- `GET /api/v1/incidents/catalogs/types` → Lista de tipos (`idTipoIncidente`, `nombre`, `descripcion`).
- `GET /api/v1/incidents/catalogs/statuses` → Lista de estados (`idEstadoIncidente`, `nombre`, `descripcion`).

---

## 4. Microservicio: `police-report-service`

- **Base URL Local:** `http://localhost:8083`
- **Esquema DB:** `police_report`

#### `POST /api/v1/police-reports`
Crea el reporte oficial de atención policial para un incidente.

- **Acceso:** `ROLE_POLICIA`, `ROLE_ADMIN`
- **Request Body (`CreatePoliceReportRequest`):**
  ```json
  {
    "idIncidente": 34,
    "idUsuarioPolicia": 2,
    "huboHeridos": false,
    "descripcionAtencion": "Se realizó persecución e interceptación de los sospechosos en la carrera 10."
  }
  ```
- **Response (201 Created - `PoliceReportResponse`):**
  ```json
  {
    "idReportePolicial": 5,
    "idIncidente": 34,
    "idUsuarioPolicia": 2,
    "huboHeridos": false,
    "descripcionAtencion": "Se realizó persecución e interceptación de los sospechosos en la carrera 10.",
    "fechaReporte": "2026-08-17T19:00:00Z",
    "fechaActualizacion": "2026-08-17T19:00:00Z"
  }
  ```

#### `GET /api/v1/police-reports/{id}`
Obtiene un reporte policial por su ID.

- **Acceso:** `ROLE_POLICIA`, `ROLE_ADMIN`
- **Response (200 OK - `PoliceReportResponse`)**

#### `GET /api/v1/police-reports/by-incident/{idIncidente}`
Obtiene los reportes policiales asociados a un incidente específico.

- **Acceso:** `ROLE_POLICIA`, `ROLE_ADMIN`
- **Response (200 OK - `List<PoliceReportResponse>`)**

---

## 5. Mapeo de Consumo en Frontends

| Frontend | Servicio JS / Función | Endpoint Consumido | Vista / Flujo |
| :--- | :--- | :--- | :--- |
| `frontend-ciudadano` | `authService.login()` | `POST /api/v1/auth/login` | Login |
| `frontend-ciudadano` | `authService.register()` | `POST /api/v1/auth/register` | Registro |
| `frontend-ciudadano` | `authService.getProfile()` | `GET /api/v1/auth/me` | Perfil |
| `frontend-ciudadano` | `caiService.getAllCai()` | `GET /api/v1/cai` | Mapa CAI (`/mapa-cai`) |
| `frontend-ciudadano` | `caiService.getNearestCai()` | `GET /api/v1/cai/nearest` | Mapa CAI (CAI cercano) |
| `frontend-ciudadano` | `incidentService.create()` | `POST /api/v1/incidents` | Crear Reporte (`/report`) |
| `frontend-ciudadano` | `incidentService.addEvidence()` | `POST /api/v1/incidents/{id}/evidences` | Crear Reporte (Evidencias) |
| `frontend-ciudadano` | `incidentService.getMyReports()` | `GET /api/v1/incidents` | Mis Reportes (`/reports`) |
| `frontend-ciudadano` | `incidentService.getById()` | `GET /api/v1/incidents/{id}` | Detalle Reporte (`/reports/:id`) |
| `frontend-policia-admin` | `authService.login()` | `POST /api/v1/auth/login` | Login Policial/Admin |
| `frontend-policia-admin` | `policeApi.fetchIncidents()` | `GET /api/v1/incidents` | Bandeja (`/reportes`) & Mapa (`/mapa`) |
| `frontend-policia-admin` | `policeApi.fetchIncidentById()` | `GET /api/v1/incidents/{id}` | Detalle Policía & Admin |
| `frontend-policia-admin` | `policeApi.fetchIncidentEvidences()` | `GET /api/v1/incidents/{id}/evidences` | Evidencias Policía & Admin |
| `frontend-policia-admin` | `policeApi.finalizePoliceAttention()` | `POST /police-reports` + `PATCH /incidents/{id}/status` | Generar Informe (`/generar-informe`) |
| `frontend-policia-admin` | `adminUsersApi.getUsers()` | `GET /api/v1/users` | Gestión Usuarios (`/admin/gestion-usuarios`) |
| `frontend-policia-admin` | `adminUsersApi.createUser()` | `POST /api/v1/users` | Crear Usuario (`/admin/crear-usuario`) |
| `frontend-policia-admin` | `adminUsersApi.updateUser()` | `PUT /api/v1/users/{id}` | Editar Usuario (`/admin/editar-usuario/:id`) |
| `frontend-policia-admin` | `adminUsersApi.deleteUser()` | `DELETE /api/v1/users/{id}` | Desactivar Usuario Admin |

---

**Entornos Seguros** | Documentación de Contratos de API - 2026