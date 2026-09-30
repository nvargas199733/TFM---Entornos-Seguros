# Guía Maestra de Instalación, Configuración y Despliegue Local

Esta guía detalla paso a paso cómo inicializar la infraestructura de base de datos con soporte geoespacial, compilar y ejecutar los tres microservicios en Spring Boot y arrancar los dos frontends en React del sistema **Entornos Seguros**.

---

## 1. Requisitos Previos del Sistema

Antes de iniciar, verifica que cuentas con las siguientes herramientas instaladas:

| Herramienta | Versión Requerida | Verificación en Terminal | Propósito |
| :--- | :---: | :--- | :--- |
| **Java JDK** | 21 LTS | `java -version` | Ejecución de los microservicios Spring Boot |
| **Node.js** | 20.x o superior | `node -v` | Entorno de ejecución para Vite / React |
| **npm** | 10.x o superior | `npm -v` | Gestor de paquetes frontend |
| **Docker & Compose** | 24.x+ / v2 | `docker compose version` | Motor de contenedores para PostgreSQL / PostGIS |
| **Git** | 2.40+ | `git --version` | Control de versiones |

> [!IMPORTANT]
> El microservicio `auth-user-service` requiere **PostGIS** (`hibernate-spatial` y funciones nativas `ST_Distance`). Asegúrate de que el motor de base de datos cuente con la extensión PostGIS instalada y habilitada.

---

## 2. Paso 1: Base de Datos y Soporte PostGIS

Los microservicios implementan el patrón **Schema-per-Service** sobre una misma base de datos relacional. Los esquemas requeridos son:
- `auth_user`: Gestión de usuarios, roles y catálogo geográfico de CAIs.
- `incident`: Tipos, estados, incidentes, evidencias y trazabilidad histórica.
- `police_report`: Informes oficiales expedidos por las patrullas policiales.

### 2.1. Levantar Contenedores con Docker

En la raíz del proyecto ejecuta:

```bash
docker compose up -d postgres
```

> [!NOTE]
> Para garantizar compatibilidad con las consultas espaciales del catálogo CAI (`geography(Point,4326)`), se recomienda usar una imagen con PostGIS como `postgis/postgis:16-3.4-alpine`.

### 2.2. Script SQL de Inicialización y Seeding de Datos

Para que los microservicios y frontends funcionen inmediatamente con las credenciales de prueba (`ADMIN` y `POLICIA`) y cuenten con datos georreferenciados de CAIs, ejecuta el siguiente script en PostgreSQL (vía `psql`, pgAdmin o DBeaver):

```sql
-- 1. Habilitar extensión espacial PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Crear los esquemas de cada microservicio
CREATE SCHEMA IF NOT EXISTS auth_user;
CREATE SCHEMA IF NOT EXISTS incident;
CREATE SCHEMA IF NOT EXISTS police_report;

-- 3. Catálogo de Roles en auth_user
INSERT INTO auth_user.rol (id_rol, nombre, descripcion)
VALUES 
    (1, 'ADMINISTRADOR', 'Administrador del sistema con acceso global'),
    (2, 'POLICIA', 'Agente operativo policial para atención de incidentes'),
    (3, 'USUARIO', 'Ciudadano para reporte y seguimiento')
ON CONFLICT (id_rol) DO NOTHING;

-- 4. Usuarios de prueba (Contraseñas con hash BCrypt):
--    - Admin:   Admin123!   -> $2a$10$eACCYoNOHEqgkVE8aVnFeO1z18iV0wZ65aU2p74.wS2mUvQyQ3Fqa
--    - Policia: Policia123! -> $2a$10$vWd2J0x0yK4mO0F5z6H1rOFn4r8j5vM2s7Y1u8Q2e4W6r8T0y2U4O
INSERT INTO auth_user.usuario (id_rol, cedula, nombres, apellidos, telefono, correo, contrasena_hash, activo, fecha_creacion)
VALUES 
    (1, '80000001', 'Administrador', 'Principal', '3001112233', 'admin@entornosseguros.gov.co', '$2a$10$eACCYoNOHEqgkVE8aVnFeO1z18iV0wZ65aU2p74.wS2mUvQyQ3Fqa', true, NOW()),
    (2, '80000002', 'Oficial', 'Patrullero', '3004445566', 'policia@entornosseguros.gov.co', '$2a$10$vWd2J0x0yK4mO0F5z6H1rOFn4r8j5vM2s7Y1u8Q2e4W6r8T0y2U4O', true, NOW())
ON CONFLICT DO NOTHING;

-- 5. CAIs de Muestra en Bogotá (con geometría EPSG:4326)
INSERT INTO auth_user.cai (codigo, nombre, direccion, telefono, localidad, latitud, longitud, geom, activo)
VALUES 
    ('CAI-01', 'CAI Chapinero', 'Calle 63 con Carrera 13', '6013150001', 'Chapinero', 4.6486, -74.0632, ST_SetSRID(ST_MakePoint(-74.0632, 4.6486), 4326)::geography, true),
    ('CAI-02', 'CAI Parque de la 93', 'Carrera 11A con Calle 93A', '6013150002', 'Chapinero', 4.6766, -74.0519, ST_SetSRID(ST_MakePoint(-74.0519, 4.6766), 4326)::geography, true),
    ('CAI-03', 'CAI Usaquén', 'Carrera 7 con Calle 119', '6013150003', 'Usaquén', 4.6983, -74.0298, ST_SetSRID(ST_MakePoint(-74.0298, 4.6983), 4326)::geography, true),
    ('CAI-04', 'CAI Teusaquillo', 'Calle 34 con Carrera 19', '6013150004', 'Teusaquillo', 4.6272, -74.0725, ST_SetSRID(ST_MakePoint(-74.0725, 4.6272), 4326)::geography, true),
    ('CAI-05', 'CAI Ciudad Salitre', 'Avenida La Esperanza con Calle 50', '6013150005', 'Fontibón', 4.6542, -74.1086, ST_SetSRID(ST_MakePoint(-74.1086, 4.6542), 4326)::geography, true)
ON CONFLICT (codigo) DO NOTHING;
```

---

## 3. Paso 2: Ejecutar los Microservicios Backend

Los tres microservicios están agrupados en un proyecto multi-módulo de Gradle bajo el directorio `backend/`.

### 3.1. Variables de Entorno del Backend

Los archivos `application.yml` de cada microservicio leen las siguientes variables de configuración (con valores por defecto para desarrollo local):

| Variable | Valor por Defecto Local | Descripción |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/entorno_seguros_db` | URL JDBC de conexión a PostgreSQL |
| `DB_USERNAME` | `postgres` (o `entornos_user`) | Usuario de la base de datos |
| `DB_PASSWORD` | `postgres` (o `TuContrasenaSegura123!`) | Contraseña del usuario de base de datos |
| `SERVER_PORT` | `8081` / `8082` / `8083` | Puerto HTTP del servicio |
| `JWT_SECRET` | `entornos-seguros-jwt-secret-for-dev-min-32-bytes` | Clave secreta HMAC para firma de tokens |
| `JWT_EXPIRATION` | `86400000` (24 horas en ms) | Duración de validez del JWT |

> [!TIP]
> Si tu PostgreSQL local tiene la base de datos con nombre en plural (`entornos_seguros_db`) o usuario `entornos_user`, define las variables en tu entorno antes de arrancar los servicios o inclúyelas como parámetro:  
> `-DDB_URL=jdbc:postgresql://localhost:5432/entornos_seguros_db -DDB_USERNAME=entornos_user -DDB_PASSWORD=TuContrasenaSegura123!`

### 3.2. Compilación del Backend

Para compilar y verificar los 3 subproyectos sin ejecutar pruebas unitarias:

* **En Windows (PowerShell):**
  ```powershell
  cd backend
  .\gradlew.bat build -x test
  ```

* **En Linux / macOS (Bash):**
  ```bash
  cd backend
  ./gradlew build -x test
  ```

### 3.3. Arranque de los Microservicios en Terminales Separadas

Abre **3 terminales independientes** (o usa los Run Configurations de IntelliJ IDEA / VS Code):

#### Terminal 1 — `auth-user-service` (Puerto 8081)
```powershell
# Windows PowerShell
cd backend
.\gradlew.bat :auth-user-service:bootRun

# Linux / macOS
cd backend
./gradlew :auth-user-service:bootRun
```

#### Terminal 2 — `incident-service` (Puerto 8082)
```powershell
# Windows PowerShell
cd backend
.\gradlew.bat :incident-service:bootRun

# Linux / macOS
cd backend
./gradlew :incident-service:bootRun
```

#### Terminal 3 — `police-report-service` (Puerto 8083)
```powershell
# Windows PowerShell
cd backend
.\gradlew.bat :police-report-service:bootRun

# Linux / macOS
cd backend
./gradlew :police-report-service:bootRun
```

### 3.4. Verificación de Salud (Health Checks)

Comprueba que los tres microservicios respondan correctamente:

* **Con cURL:**
  ```bash
  curl http://localhost:8081/api/v1/auth/health
  curl http://localhost:8082/api/v1/incidents/health
  curl http://localhost:8083/api/v1/police-reports/health
  ```

* **Con PowerShell:**
  ```powershell
  Invoke-RestMethod http://localhost:8081/api/v1/auth/health
  Invoke-RestMethod http://localhost:8082/api/v1/incidents/health
  Invoke-RestMethod http://localhost:8083/api/v1/police-reports/health
  ```

Respuesta esperada: `{"service": "<nombre-servicio>", "status": "UP"}`.

---

## 4. Paso 3: Ejecutar las Aplicaciones Frontend

Cada aplicación es una SPA independiente basada en **React 19** y empaquetada con **Vite 8**.

### 4.1. Frontend Ciudadano (Puerto 5173)

Destinado al rol `USUARIO` para registro, reporte ciudadano de incidentes, seguimiento y mapa de CAIs:

```bash
# Terminal 4
cd frontend-ciudadano
npm install
npm run dev
```

URL de acceso: [http://localhost:5173](http://localhost:5173)

#### Variables de Entorno Frontend Ciudadano (opcional en `.env.local`):
```env
VITE_API_BASE_URL=http://localhost:8081
VITE_INCIDENT_API_BASE_URL=http://localhost:8082/api/v1/incidents
```

---

### 4.2. Frontend Policía y Administrador (Puerto 5174)

Destinado a agentes policiales (rol `POLICIA`) y coordinadores (rol `ADMINISTRADOR`):

```bash
# Terminal 5
cd frontend-policia-admin
npm install
npm run dev
```

URL de acceso: [http://localhost:5174](http://localhost:5174)

#### Variables de Entorno Frontend Policía/Admin (opcional en `.env.local`):
```env
VITE_AUTH_API_BASE_URL=http://localhost:8081/api/v1/auth
VITE_INCIDENT_API_BASE_URL=http://localhost:8082/api/v1/incidents
VITE_POLICE_REPORT_API_BASE_URL=http://localhost:8083/api/v1/police-reports
```

---

## 5. Matriz de Credenciales de Prueba

Una vez ejecutado el script SQL de inicialización:

| Perfil / Rol | Correo Electrónico | Contraseña | Aplicación Destino | Capacidades |
| :--- | :--- | :--- | :--- | :--- |
| **Ciudadano** (`USUARIO`) | *Registrable libremente desde la app* | *Definida al registrarse* | [http://localhost:5173](http://localhost:5173) | Reportar incidentes, subir evidencias, ver mis reportes, mapa de CAIs cercanos. |
| **Policía** (`POLICIA`) | `policia@entornosseguros.gov.co` | `Policia123!` | [http://localhost:5174](http://localhost:5174) | Mapa operativo en tiempo real de Bogotá, bandeja de casos, generar informes oficiales. |
| **Administrador** (`ADMINISTRADOR`) | `admin@entornosseguros.gov.co` | `Admin123!` | [http://localhost:5174/admin](http://localhost:5174/admin) | Gestión y CRUD de usuarios, auditoría global de incidentes y reportes asociados. |

---

## 6. Solución de Problemas Comunes (Troubleshooting)

### 1. `FATAL: database "entorno_seguros_db" does not exist`
* **Causa:** El contenedor Docker creó `entornos_seguros_db` (en plural) pero el default en `application.yml` es `entorno_seguros_db` (en singular).
* **Solución:** Crea la base de datos correspondiente en PostgreSQL (`CREATE DATABASE entorno_seguros_db;`) o ejecuta el microservicio pasando la variable:
  ```powershell
  $env:DB_URL="jdbc:postgresql://localhost:5432/entornos_seguros_db"
  ```

### 2. `ERROR: type "geography" does not exist`
* **Causa:** La base de datos no tiene habilitada la extensión espacial PostGIS requerida por `auth_user.cai`.
* **Solución:** Conéctate a la base de datos con un usuario privilegiado y ejecuta:
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis;
  ```

### 3. `Port already in use` (8081, 8082, 8083, 5173, 5174)
* **Causa:** Otro proceso está ocupando el puerto requerido.
* **Solución en Windows:**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess | Stop-Process -Force
  ```
* **Solución en Linux/macOS:**
  ```bash
  lsof -ti :8081 | xargs kill -9
  ```

### 4. `Credenciales inválidas` al intentar entrar como Admin o Policía
* **Causa:** La tabla `auth_user.usuario` no cuenta con los registros iniciales sembrados.
* **Solución:** Ejecuta el bloque SQL de la sección 2.2 de esta guía.

### 5. Error de CORS en la consola del navegador
* **Causa:** Las peticiones del frontend se originan desde un puerto no listado en `cors.allowed-origins`.
* **Solución:** Los servicios permiten por defecto `http://localhost:5173` y `http://localhost:5174`. Si utilizas otro puerto (por ejemplo 5175), define la variable `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175`.

---

**Entornos Seguros** | Guía Maestra de Configuración Local - 2026