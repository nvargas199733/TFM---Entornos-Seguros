# Backend Monorepo - Entornos Seguros

Backend multi-módulo basado en **Java 21 LTS** y **Spring Boot 3.2.x**, gestionado con **Gradle**. Implementa una arquitectura de microservicios con persistencia *schema-per-service* sobre PostgreSQL 16.

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

## 3. Compilación y Ejecución

### 3.1. Compilar Todos los Subproyectos
```bash
# Desde la carpeta backend/
./gradlew build -x test
```

### 3.2. Ejecución Individual de Servicios
```bash
# Terminal 1 - Auth User Service
./gradlew :auth-user-service:bootRun

# Terminal 2 - Incident Service
./gradlew :incident-service:bootRun

# Terminal 3 - Police Report Service
./gradlew :police-report-service:bootRun
```

### 3.3. Health Checks
- `GET http://localhost:8081/api/v1/auth/health`
- `GET http://localhost:8082/api/v1/incidents/health`
- `GET http://localhost:8083/api/v1/police-reports/health`

---

## 4. Estándares Técnicos
- **Desacoplamiento Relacional:** No existen claves foráneas físicas entre tablas de esquemas diferentes.
- **Seguridad:** Tokens JWT firmados compartidos; filtros de seguridad Spring Security configurados con `hasRole('ADMIN')`, `hasRole('POLICIA')`, `hasRole('USUARIO')`.
- **Manejo de Errores:** Controladores REST con `@ExceptionHandler` estructurados mediante respuestas `ApiErrorResponse`.

---

**Entornos Seguros** | Backend Monorepo - 2026
