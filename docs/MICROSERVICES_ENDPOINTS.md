# Catálogo Operativo de Microservicios y Endpoints

Guía de referencia rápida y operativa con comandos `curl`, payloads JSON, variables de entorno y validación de endpoints para los microservicios de **Entornos Seguros**.

---

## 1. Resumen de Microservicios

| Microservicio | Puerto | Esquema PostgreSQL | Base Path | Responsabilidad |
| :--- | :---: | :--- | :--- | :--- |
| **`auth-user-service`** | `8081` | `auth_user` | `/api/v1/auth`, `/api/v1/users`, `/api/v1/cai` | Autenticación JWT, cuentas, roles RBAC, catálogo de CAIs (PostGIS). |
| **`incident-service`** | `8082` | `incident` | `/api/v1/incidents` | Creación de incidentes, evidencias, historial y catálogos de tipos/estados. |
| **`police-report-service`** | `8083` | `police_report` | `/api/v1/police-reports` | Registro de informes policiales oficiales y atención de casos. |

---

## 2. Operaciones con `auth-user-service` (:8081)

### 2.1. Health Check
```bash
curl -X GET http://localhost:8081/api/v1/auth/health
```
*Respuesta:* `{"service": "auth-user-service", "status": "UP"}`

### 2.2. Registro de Usuario Ciudadano
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "1098765432",
    "nombres": "Laura",
    "apellidos": "Martínez",
    "telefono": "3158765432",
    "email": "laura@example.com",
    "password": "PasswordSeguro123!"
  }'
```

### 2.3. Inicio de Sesión (Obtener JWT)
```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "laura@example.com",
    "password": "PasswordSeguro123!"
  }'
```

### 2.4. Consultar Perfil con JWT
```bash
curl -X GET http://localhost:8081/api/v1/auth/me \
  -H "Authorization: Bearer <TOKEN_AQUI>"
```

### 2.5. Gestión de Usuarios (Requiere `ROLE_ADMIN`)
```bash
# Listar usuarios
curl -X GET http://localhost:8081/api/v1/users \
  -H "Authorization: Bearer <TOKEN_ADMIN>"

# Crear usuario policía o administrador
curl -X POST http://localhost:8081/api/v1/users \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "79123456",
    "nombres": "Oficial Carlos",
    "apellidos": "Mendoza",
    "email": "carlos.mendoza@policia.gov.co",
    "telefono": "3104445566",
    "password": "PoliciaPassword123!",
    "rol": "POLICIA"
  }'

# Desactivar usuario
curl -X DELETE http://localhost:8081/api/v1/users/5 \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

### 2.6. Catálogo de CAIs (PostGIS)
```bash
# Listar todos los CAIs
curl -X GET http://localhost:8081/api/v1/cai

# CAI más cercano a coordenadas de Chapinero
curl -X GET "http://localhost:8081/api/v1/cai/nearest?lat=4.6486&lng=-74.0632"
```

---

## 3. Operaciones con `incident-service` (:8082)

### 3.1. Health Check
```bash
curl -X GET http://localhost:8082/api/v1/incidents/health
```

### 3.2. Catálogos de Tipos y Estados
```bash
curl -X GET http://localhost:8082/api/v1/incidents/catalogs/types
curl -X GET http://localhost:8082/api/v1/incidents/catalogs/statuses
```

### 3.3. Crear Incidente Ciudadano
```bash
curl -X POST http://localhost:8082/api/v1/incidents \
  -H "Authorization: Bearer <TOKEN_CIUDADANO>" \
  -H "Content-Type: application/json" \
  -d '{
    "idTipoIncidente": 1,
    "descripcion": "Hurto de celular en la estación de TransMilenio Calle 100",
    "latitud": 4.6852,
    "longitud": -74.0561,
    "direccionReferencia": "Autopista Norte con Calle 100"
  }'
```

### 3.4. Agregar Evidencia a un Incidente
```bash
curl -X POST http://localhost:8082/api/v1/incidents/1/evidences \
  -H "Authorization: Bearer <TOKEN_CIUDADANO>" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoArchivo": "imagen",
    "urlArchivo": "https://storage.entornosseguros.gov.co/evidencias/caso1_foto1.jpg",
    "nombreArchivo": "foto_estacion_transmilenio.jpg"
  }'
```

### 3.5. Consultar Evidencias de un Incidente
```bash
curl -X GET http://localhost:8082/api/v1/incidents/1/evidences \
  -H "Authorization: Bearer <TOKEN_JWT>"
```

### 3.6. Cambiar Estado del Incidente (Policía / Admin)
```bash
curl -X PATCH http://localhost:8082/api/v1/incidents/1/status \
  -H "Authorization: Bearer <TOKEN_POLICIA>" \
  -H "Content-Type: application/json" \
  -d '{
    "idEstadoIncidente": 3,
    "idUsuarioResponsable": 2,
    "observacion": "Caso atendido por patrulla del cuadrante. Informe oficial radicado."
  }'
```

---

## 4. Operaciones con `police-report-service` (:8083)

### 4.1. Health Check
```bash
curl -X GET http://localhost:8083/api/v1/police-reports/health
```

### 4.2. Crear Informe Policial Oficial
```bash
curl -X POST http://localhost:8083/api/v1/police-reports \
  -H "Authorization: Bearer <TOKEN_POLICIA>" \
  -H "Content-Type: application/json" \
  -d '{
    "idIncidente": 1,
    "idUsuarioPolicia": 2,
    "huboHeridos": false,
    "descripcionAtencion": "Se acudió al punto de reporte en la Calle 100. Se tomó declaración a la víctima y se activó el plan candado en el sector."
  }'
```

### 4.3. Consultar Informe Policial por Incidente
```bash
curl -X GET http://localhost:8083/api/v1/police-reports/by-incident/1 \
  -H "Authorization: Bearer <TOKEN_JWT>"
```

---

**Entornos Seguros** | Catálogo Operativo de Endpoints - 2026
