# Guía de Instalación, Configuración y Despliegue Local

Esta guía detalla paso a paso cómo inicializar la infraestructura, compilar el backend multi-módulo en Spring Boot y arrancar los frontends en React del sistema **Entornos Seguros**.

---

## 1. Requisitos del Sistema

| Herramienta | Versión Recomendada | Comprobación en Terminal |
| :--- | :--- | :--- |
| **Java JDK** | 21 LTS | `java -version` |
| **Node.js** | 20.x o superior | `node -v` |
| **npm** | 10.x o superior | `npm -v` |
| **Docker & Compose** | 24.x+ / Compose v2 | `docker compose version` |
| **Git** | 2.40+ | `git --version` |

---

## 2. Paso 1: Levantar Infraestructura con Docker

En la raíz del proyecto se encuentra el archivo `docker-compose.yml` que orquesta la base de datos PostgreSQL, Redis y pgAdmin.

```bash
# Desde la raíz del repositorio
docker compose up -d
```

### Servicios expuestos:
- **PostgreSQL 16:** `localhost:5432` (Usuario: `entornos_user`, DB: `entornos_seguros_db`)
- **Redis 7:** `localhost:6379`
- **pgAdmin 4:** `http://localhost:5050` (Email: `admin@entornosseguros.gov.co`, Password: `AdminPassword123!`)

---

## 3. Paso 2: Ejecutar los Microservicios Backend

El backend se gestiona mediante el **Gradle Wrapper** multi-módulo ubicado en `backend/`.

### 3.1. Compilación y Validación de los 3 Servicios
```bash
cd backend

# En Linux / macOS:
./gradlew build -x test

# En Windows PowerShell:
.\gradlew.bat build -x test
```

### 3.2. Arranque de los Microservicios
Abre tres terminales independientes o utiliza los paneles de ejecución de tu IDE (IntelliJ IDEA, VS Code, Eclipse):

```bash
# Terminal 1: auth-user-service (:8081)
cd backend
./gradlew :auth-user-service:bootRun

# Terminal 2: incident-service (:8082)
cd backend
./gradlew :incident-service:bootRun

# Terminal 3: police-report-service (:8083)
cd backend
./gradlew :police-report-service:bootRun
```

### 3.3. Verificación de Health Checks
```bash
curl http://localhost:8081/api/v1/auth/health
curl http://localhost:8082/api/v1/incidents/health
curl http://localhost:8083/api/v1/police-reports/health
```

---

## 4. Paso 3: Ejecutar las Aplicaciones Frontend

Cada frontend es una Single Page Application (SPA) independiente en Vite.

### 4.1. Frontend Ciudadano (:5173)
```bash
cd frontend-ciudadano
npm install
npm run dev
```
Acceso en el navegador: [http://localhost:5173](http://localhost:5173)

### 4.2. Frontend Policía y Administrador (:5174)
```bash
cd frontend-policia-admin
npm install
npm run dev
```
Acceso en el navegador: [http://localhost:5174](http://localhost:5174)

---

## 5. Variables de Entorno

### 5.1. Backend (`application.yml` / System Env)

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/entornos_seguros_db` | Conexión JDBC a PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | `entornos_user` | Usuario de base de datos |
| `SPRING_DATASOURCE_PASSWORD` | `TuContrasenaSegura123!` | Contraseña de base de datos |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | Clave secreta para firma HMAC |
| `JWT_EXPIRATION` | `86400000` (24 horas) | Tiempo de validez del token en ms |

### 5.2. Frontend (`.env` opcional)

| Variable | Valor por Defecto | Aplicación |
| :--- | :--- | :--- |
| `VITE_AUTH_API_BASE_URL` | `http://localhost:8081/api/v1/auth` | Ambos frontends |
| `VITE_INCIDENT_API_BASE_URL` | `http://localhost:8082/api/v1/incidents` | Ambos frontends |
| `VITE_POLICE_REPORT_API_BASE_URL` | `http://localhost:8083/api/v1/police-reports` | `frontend-policia-admin` |

---

## 6. Usuarios y Credenciales de Prueba

Al iniciar la base de datos y los microservicios con bootstrap automático:

| Rol | Correo / Usuario | Contraseña | Destino en Login |
| :--- | :--- | :--- | :--- |
| **USUARIO** (Ciudadano) | *Registrable desde `/register`* | *Definida en registro* | `http://localhost:5173/` |
| **POLICIA** (Agente) | `policia@entornosseguros.gov.co` | `Policia123!` | `http://localhost:5174/` |
| **ADMINISTRADOR** (Admin) | `admin@entornosseguros.gov.co` | `Admin123!` | `http://localhost:5174/admin` |

---

## 7. Solución de Problemas Comunes (Troubleshooting)

1. **Error de conexión a PostgreSQL (`Connection refused: 5432`):**
   - Asegúrate de haber ejecutado `docker compose up -d` y que el contenedor esté en estado `healthy`.
2. **Conflicto de Puertos (`Port already in use`):**
   - Verifica que los puertos `8081`, `8082`, `8083`, `5173`, `5174` no estén ocupados por otros procesos locales (`netstat -ano | findstr :8081` en Windows o `lsof -i :8081` en Linux/macOS).
3. **CORS Error en el navegador:**
   - La configuración de seguridad en Spring Security habilita peticiones desde orígenes locales `http://localhost:5173` y `http://localhost:5174`.

---

**Entornos Seguros** | Guía de Setup y Despliegue - 2026