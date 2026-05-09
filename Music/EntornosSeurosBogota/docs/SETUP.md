# 📚 GUÍA DE CONFIGURACIÓN - Entornos Seguros Bogotá

## 🚀 Inicio Rápido (5 minutos)

### Opción 1: Con Docker Compose (Recomendado)

#### 1. Verificar Requisitos
```bash
docker --version  # v20.10+
docker-compose --version  # v2.0+
```

#### 2. Clonar/Descargar el Proyecto
```bash
cd EntornosSeurosBogota
```

#### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
# Si es necesario, editar .env con valores específicos
```

#### 4. Iniciar Servicios
```bash
docker-compose up -d
```

**Servicios iniciados:**
- 🗄️ PostgreSQL en `localhost:5432` (usuario: `entornos_user`)
- 📊 PgAdmin en `http://localhost:5050`
- 💾 Redis en `localhost:6379`

#### 5. Ejecutar Migraciones (Automático)
Las migraciones se ejecutan automáticamente al iniciar el backend.

---

### Opción 2: Instalación Local

#### Requisitos Previos
- **Java 17+**: [Descargar](https://adoptium.net/)
- **Maven 3.8+**: [Descargar](https://maven.apache.org/)
- **PostgreSQL 16**: [Descargar](https://www.postgresql.org/)
- **Redis 7** (opcional): [Descargar](https://redis.io/)

#### 1. Crear Base de Datos
```sql
-- Conectarse a PostgreSQL como superuser
CREATE DATABASE entornos_seguros_db;
CREATE USER entornos_user WITH PASSWORD 'TuContrasenaSegura123!';
ALTER ROLE entornos_user SET client_encoding TO 'utf8';
ALTER ROLE entornos_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE entornos_user SET default_transaction_deferrable TO on;
ALTER ROLE entornos_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE entornos_seguros_db TO entornos_user;
```

#### 2. Compilar Backend
```bash
cd backend
mvn clean install
```

#### 3. Ejecutar Backend
```bash
mvn spring-boot:run
```

Backend disponible en `http://localhost:8080/api`

#### 4. Compilar Frontend
```bash
cd frontend
mvn clean install
```

#### 5. Ejecutar Frontend
```bash
mvn javafx:run
```

---

## ⚙️ Configuración de Desarrollo

### IDE: IntelliJ IDEA

1. **Importar Proyecto**
   - `File → Open → Seleccionar carpeta raíz → OK`

2. **Configurar JDK**
   - `File → Project Structure → Project`
   - Seleccionar Java 17

3. **Configurar Ejecución**
   - `Run → Edit Configurations`
   - Agregar configuración Maven para cada módulo

### IDE: VS Code

1. **Instalar Extensiones**
   - Extension Pack for Java
   - Maven for Java
   - Project Manager for Java
   - Spring Boot Extension Pack

2. **Configurar Workspace**
   - Crear `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Backend Spring Boot",
         "type": "java",
         "name": "Spring Boot App",
         "request": "launch",
         "mainClass": "com.entornosseguros.EntornosSeurosBogotaApplication",
         "projectName": "entornos-seguros-backend",
         "cwd": "${workspaceFolder}"
       }
     ]
   }
   ```

---

## 🔐 Credenciales Iniciales

### Super Administrador
- **Email**: `admin@entornosseguros.gov.co`
- **Contraseña**: `Admin123!` (cambiar en primer acceso)

### Administrador General
- **Email**: `admin.general@entornosseguros.gov.co`
- **Contraseña**: `Admin123!`

### Ciudadano Demo
- **Email**: `ciudadano@entornosseguros.gov.co`
- **Contraseña**: `Admin123!`

### Policía Demo
- **Email**: `policia@entornosseguros.gov.co`
- **Contraseña**: `Admin123!`

⚠️ **IMPORTANTE**: Cambiar todas las contraseñas después del primer acceso.

---

## 📁 Estructura de Carpetas Explicada

```
backend/
├── src/main/java/com/entornosseguros/
│   ├── api/                      # Rutas y configuración de API
│   ├── config/                   # Configuraciones globales (Security, CORS, etc.)
│   ├── controller/               # Controladores REST
│   ├── dto/                      # Data Transfer Objects (request/response)
│   ├── entity/                   # Entidades JPA (modelos de BD)
│   ├── exception/                # Excepciones personalizadas
│   ├── repository/               # Interfaces JPA Repository
│   ├── security/                 # JWT, filtros de seguridad
│   ├── service/                  # Lógica de negocio
│   └── websocket/                # Controladores WebSocket
└── src/main/resources/
    ├── application.properties     # Config principal
    ├── db/migration/             # Scripts Flyway
    └── [perfiles]

frontend/
├── src/main/java/com/entornosseguros/
│   ├── app/                      # Clase Main y App
│   ├── controller/               # Controladores de vistas FXML
│   ├── model/                    # Modelos de datos
│   ├── service/                  # Servicios (API, WebSocket)
│   └── ui/
│       ├── components/           # Componentes reutilizables
│       ├── scenes/               # Pantallas principales
│       ├── styles/               # Lógica de estilos
│       └── utils/                # Utilidades UI
└── src/main/resources/
    ├── css/                      # Hojas de estilos
    ├── fxml/                     # Archivos XML de interfaces
    ├── images/                   # Imágenes y fondos
    └── icons/                    # Iconos SVG/PNG
```

---

## 🗄️ Base de Datos

### Tablas Principales
- **users** - Usuarios del sistema
- **roles** - Roles y permisos
- **incidents** - Reportes de incidentes
- **incident_types** - Tipos de incidentes
- **priority_levels** - Niveles de prioridad
- **status** - Estados de incidentes
- **cai** - Centros de Atención Inmediata
- **media** - Fotos y videos adjuntos
- **notifications** - Notificaciones del sistema
- **activity_log** - Auditoría de cambios

### Acceder a PgAdmin
- URL: `http://localhost:5050`
- Email: `admin@entornosseguros.gov.co`
- Contraseña: (establecida en `.env`)

### Crear Servidor en PgAdmin
1. `Object → Register → Server`
2. General Tab:
   - Name: `Entornos Seguros BD`
3. Connection Tab:
   - Host: `postgres`
   - Port: `5432`
   - Username: `entornos_user`
   - Password: (desde `.env`)

---

## 🔌 Integración de APIs Externas

### Google Maps API

1. **Obtener API Key**
   - Ir a [Google Cloud Console](https://console.cloud.google.com/)
   - Crear proyecto
   - Habilitar: Maps JavaScript API, Geocoding API, Distance Matrix API
   - Crear credenciales (API Key)

2. **Configurar en Proyecto**
   ```properties
   # application.properties
   app.google.maps.api-key=TU_API_KEY_AQUI
   ```

---

## 🌐 Endpoints Principales (Backend)

```
POST   /api/v1/auth/login                    - Iniciar sesión
POST   /api/v1/auth/register                 - Registrarse
GET    /api/v1/incidents                     - Listar incidentes
POST   /api/v1/incidents                     - Crear incidente
GET    /api/v1/incidents/{id}                - Detalle de incidente
PUT    /api/v1/incidents/{id}                - Actualizar incidente
DELETE /api/v1/incidents/{id}                - Eliminar incidente
GET    /api/v1/analytics/heatmap             - Datos heatmap
GET    /api/v1/cai/nearest                   - CAI más cercano
GET    /api/v1/users                         - Listar usuarios (Admin)
```

Documentación completa en [API.md](API.md)

---

## 📊 Monitoreo y Logs

### Ver Logs del Backend
```bash
# Docker
docker logs entornos-seguros-api -f

# Local
# Los logs aparecen en consola directamente
```

### Niveles de Log
- `DEBUG` - Información detallada (desarrollo)
- `INFO` - Eventos importantes
- `WARN` - Advertencias
- `ERROR` - Errores

### Cambiar Nivel de Log
```properties
# application.properties
logging.level.com.entornosseguros=DEBUG
logging.level.root=INFO
```

---

## 🐞 Troubleshooting

### Error: "Connection refused" (Base de Datos)
```bash
# Verificar contenedor PostgreSQL
docker ps | grep postgres

# Reiniciar contenedor
docker-compose restart postgres

# Verificar logs
docker logs entornos-seguros-db
```

### Error: "Port already in use"
```bash
# Cambiar puerto en docker-compose.yml o aplicación.properties
# Ej: cambiar 8080:8080 a 8081:8080
```

### Error compiling Frontend JavaFX
```bash
# Limpiar caché Maven
mvn clean

# Actualizar dependencias
mvn dependency:resolve

# Compilar nuevamente
mvn javafx:run
```

### PostgreSQL: "role entornos_user does not exist"
```bash
# Recrear usuario
docker exec entornos-seguros-db psql -U postgres -c \
  "CREATE USER entornos_user WITH PASSWORD 'TuContrasenaSegura123!'; \
   GRANT ALL PRIVILEGES ON DATABASE entornos_seguros_db TO entornos_user;"
```

---

## 📚 Recursos Adicionales

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [JavaFX Documentation](https://openjfx.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Docs](https://docs.docker.com/)
- [JWT Tokens](https://jwt.io/)

---

## ✅ Checklist de Configuración Completo

- [ ] Clonar/descargar proyecto
- [ ] Copiar `.env.example` a `.env`
- [ ] Instalar Docker y Docker Compose
- [ ] Ejecutar `docker-compose up -d`
- [ ] Verificar servicios están corriendo
- [ ] Compilar backend: `mvn clean install`
- [ ] Compilar frontend: `mvn clean install`
- [ ] Ejecutar backend
- [ ] Ejecutar frontend
- [ ] Acceder a PgAdmin para verificar BD
- [ ] Probar login con credenciales iniciales
- [ ] ¡Listo para desarrollar! 🎉

---

**Última actualización**: Enero 2026
**Versión**: 1.0.0
