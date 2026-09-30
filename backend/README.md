# Backend Monorepo - Entornos Seguros

Backend multi-módulo basado en **Java 21 LTS** y **Spring Boot 3.5.x**, gestionado con **Gradle**. Implementa una arquitectura de microservicios con persistencia *schema-per-service* sobre PostgreSQL 16 con soporte geoespacial (PostGIS).

---

## 1. Subproyectos y Módulos

```text
backend/
├── auth-user-service/           # Microservicio de Autenticación, Usuarios y CAI (:8081)
├── incident-service/            # Microservicio de Gestión de Incidentes y Evidencias (:8082)
├── police-report-service/       # Microservicio de Reportes Oficiales de Policía (:8083)
├── build.gradle                 # Configuración compartida y plugins comunes
├── settings.gradle              # Definición de submódulos
└── gradlew / gradlew.bat        # Gradle Wrapper ejecutable
```

---

## 2. Puertos y Mapeo de Esquemas

| Microservicio | Puerto por Defecto | Esquema PostgreSQL | Base Path |
| :--- | :---: | :--- | :--- |
| **`auth-user-service`** | `8081` | `auth_user` | `/api/v1/auth`, `/api/v1/users`, `/api/v1/cai` |
| **`incident-service`** | `8082` | `incident` | `/api/v1/incidents` |
| **`police-report-service`** | `8083` | `police_report` | `/api/v1/police-reports` |

---

## 3. Variables de Entorno de los Servicios

Cada servicio lee las siguientes variables desde su `application.yml` o del entorno del sistema:

| Variable | Valor por Defecto Local | Descripción |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/entorno_seguros_db` | Cadena JDBC de PostgreSQL |
| `DB_USERNAME` | `postgres` | Usuario con permisos en los esquemas |
| `DB_PASSWORD` | `postgres` | Contraseña del usuario |
| `SERVER_PORT` | `8081` / `8082` / `8083` | Puerto HTTP del servicio |
| `JWT_SECRET` | `entornos-seguros-jwt-secret-for-dev-min-32-bytes` | Secreto HMAC para firma y verificación de JWT |
| `JWT_EXPIRATION` | `86400000` | Expiración del token en milisegundos (24h) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:5174` | Orígenes HTTP permitidos para peticiones CORS |

---

## 4. Compilación y Ejecución

### 4.1. Compilar Todos los Subproyectos

* **En Windows (PowerShell):**
  ```powershell
  cd backend
  .\gradlew.bat build -x test
  ```

* **En Linux / macOS:**
  ```bash
  cd backend
  ./gradlew build -x test
  ```

### 4.2. Ejecución Individual de Servicios

Abre una terminal independiente por microservicio:

* **En Windows PowerShell:**
  ```powershell
  # Terminal 1 - Auth & Users Service
  cd backend
  .\gradlew.bat :auth-user-service:bootRun

  # Terminal 2 - Incident Service
  cd backend
  .\gradlew.bat :incident-service:bootRun

  # Terminal 3 - Police Report Service
  cd backend
  .\gradlew.bat :police-report-service:bootRun
  ```

* **En Linux / macOS:**
  ```bash
  cd backend
  ./gradlew :auth-user-service:bootRun   # Terminal 1
  ./gradlew :incident-service:bootRun    # Terminal 2
  ./gradlew :police-report-service:bootRun # Terminal 3
  ```

### 4.3. Health Checks
- `GET http://localhost:8081/api/v1/auth/health`
- `GET http://localhost:8082/api/v1/incidents/health`
- `GET http://localhost:8083/api/v1/police-reports/health`

---

## 5. Estándares Técnicos
- **Desacoplamiento Relacional:** No existen claves foráneas físicas entre tablas de esquemas diferentes.
- **Seguridad:** Tokens JWT firmados compartidos; filtros de seguridad Spring Security configurados con `hasRole('ADMIN')`, `hasRole('POLICIA')`, `hasRole('USUARIO')`.
- **Manejo de Errores:** Controladores REST con `@ExceptionHandler` estructurados mediante respuestas `ApiErrorResponse`.

---

**Entornos Seguros** | Backend Monorepo - 2026
