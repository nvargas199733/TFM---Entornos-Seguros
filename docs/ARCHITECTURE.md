# 📐 ARQUITECTURA DEL SISTEMA

## 🏗️ Visión General

**Entornos Seguros Bogotá** utiliza una arquitectura moderna **3-tier** (presentación, lógica de negocio, datos) con componentes especializados para tiempo real.

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│                    (JavaFX Desktop App)                      │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │   Login  │  │   Dashboard │  │  Mapa Interactivo    │   │
│  └──────────┘  └─────────────┘  └──────────────────────┘   │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │Reportes  │  │  Analíticas │  │ Panel de Autoridades │   │
│  └──────────┘  └─────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│            CAPA DE LÓGICA DE NEGOCIO (API REST)            │
│                  Spring Boot + Spring Security              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CONTROLADORES REST                      │  │
│  │ /api/v1/auth  /api/v1/incidents  /api/v1/analytics  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SERVICIOS (Lógica Negocio)             │  │
│  │ IncidentService | UserService | NotificationService │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           WebSocket Config (Tiempo Real)             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ JDBC/Queries
┌─────────────────────────────────────────────────────────────┐
│              CAPA DE PERSISTENCIA                            │
│  ┌─────────────────┐  ┌──────────────────────────────────┐ │
│  │   PostgreSQL    │  │  Redis Cache                     │ │
│  │                 │  │                                  │ │
│  │ - Usuarios      │  │ - Sesiones JWT                   │ │
│  │ - Incidentes    │  │ - Datos frecuentes               │ │
│  │ - CAI           │  │ - Rate Limiting                  │ │
│  │ - Media         │  │                                  │ │
│  │ - Notificaciones│  │                                  │ │
│  └─────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Principios Arquitectónicos

### 1. **Separación de Responsabilidades**
- **Controllers**: Manejo de requests/responses
- **Services**: Lógica de negocio
- **Repositories**: Acceso a datos
- **DTOs**: Transferencia de datos

### 2. **RESTful API**
- Siguiendo convenciones REST
- Status HTTP apropiados
- Versionamiento de API (`/api/v1/`)

### 3. **Seguridad**
- JWT para autenticación
- CORS configurado
- Validación de entrada
- Rate limiting

### 4. **Escalabilidad**
- Cache con Redis
- Índices en base de datos
- Conexión pool de BD
- WebSocket para notificaciones en vivo

---

## 📦 Componentes Principales

### Backend (Spring Boot)

```
entornos-seguros-backend/
├── api/
│   └── ApiConfig.java                 # Configuración de rutas API
├── config/
│   ├── SecurityConfig.java            # Seguridad + JWT
│   ├── WebSocketConfig.java           # Configuración WebSocket
│   ├── CorsConfig.java                # CORS
│   ├── CacheConfig.java               # Redis Cache
│   └── AuditingConfig.java            # Auditoría
├── controller/
│   ├── AuthController.java            # Autenticación
│   ├── IncidentController.java        # Reportes
│   ├── UserController.java            # Gestión usuarios
│   ├── AnalyticsController.java       # Estadísticas
│   ├── CAIController.java             # Centros de atención
│   └── NotificationController.java    # Notificaciones
├── dto/
│   ├── LoginRequest.java
│   ├── IncidentDTO.java
│   ├── UserDTO.java
│   └── ResponseWrapper.java
├── entity/
│   ├── User.java
│   ├── Incident.java
│   ├── IncidentType.java
│   ├── CAI.java
│   ├── Notification.java
│   └── ActivityLog.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
├── repository/
│   ├── UserRepository.java
│   ├── IncidentRepository.java
│   ├── CAIRepository.java
│   └── NotificationRepository.java
├── security/
│   ├── JwtTokenProvider.java          # Generador/Validador JWT
│   ├── JwtAuthenticationFilter.java   # Filtro JWT
│   ├── UserDetailsServiceImpl.java     # Obtener detalles de usuario
│   └── SecurityUtil.java
├── service/ (Business Logic)
│   ├── IncidentService.java
│   ├── UserService.java
│   ├── NotificationService.java
│   ├── AnalyticsService.java
│   ├── EmailService.java
│   └── GeoLocationService.java
├── websocket/
│   ├── WebSocketHandler.java          # Manejador de WebSocket
│   ├── StompController.java
│   └── IncidentWebSocketService.java
└── EntornosSeurosBogotaApplication.java
```

### Frontend (JavaFX)

```
entornos-seguros-frontend/
├── app/
│   ├── EntornosSeurosBogotaApplication.java  # Main
│   ├── SceneManager.java                      # Gestor de escenas
│   └── AppConfig.java
├── controller/
│   ├── LoginController.java
│   ├── DashboardController.java
│   ├── IncidentController.java
│   ├── MapController.java
│   ├── AnalyticsController.java
│   └── SettingsController.java
├── model/
│   ├── Incident.java
│   ├── User.java
│   ├── CAI.java
│   └── Notification.java
├── service/
│   ├── ApiService.java               # Cliente HTTP
│   ├── WebSocketService.java         # Cliente WebSocket
│   ├── AuthService.java              # Autenticación local
│   ├── CacheService.java             # Caché local
│   └── NotificationService.java
├── ui/
│   ├── components/
│   │   ├── HeaderBar.java
│   │   ├── Sidebar.java
│   │   ├── IncidentCard.java
│   │   ├── MapPane.java
│   │   └── StatsPanel.java
│   ├── scenes/
│   │   ├── LoginScene.java
│   │   ├── MainScene.java
│   │   ├── DashboardScene.java
│   │   ├── MapScene.java
│   │   ├── ReportIncidentScene.java
│   │   └── AnalyticsScene.java
│   ├── styles/
│   │   ├── ThemeManager.java
│   │   └── StyleConstants.java
│   └── utils/
│       ├── UIUtil.java
│       ├── AnimationUtil.java
│       ├── DialogUtil.java
│       └── FormatUtil.java
```

---

## 🔐 Flujo de Seguridad

### Autenticación (Login)

```
┌─────────────────────────────────────────┐
│  1. Usuario ingresa credenciales        │
│  (Email + Contraseña)                   │
└─────────────────────────────────────────┘
           ↓ POST /api/v1/auth/login
┌─────────────────────────────────────────┐
│  2. Backend valida credenciales         │
│  - Busca usuario en BD                  │
│  - Compara contraseña (BCrypt)          │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  3. Si válido, genera JWT               │
│  - Token contiene: id, email, roles     │
│  - Expira en 24 horas                   │
└─────────────────────────────────────────┘
           ↓ Response + JWT
┌─────────────────────────────────────────┐
│  4. Frontend almacena JWT               │
│  - En memoria local (no localStorage)   │
│  - Adjunta en header Authorization      │
└─────────────────────────────────────────┘
           ↓ Request + JWT
┌─────────────────────────────────────────┐
│  5. Cada request valida JWT             │
│  - Filtro JwtAuthenticationFilter       │
│  - Extrae usuario del token             │
│  - Valida permisos                      │
└─────────────────────────────────────────┘
```

### Roles y Permisos

```
┌──────────────────────────────────────────────┐
│ SUPER_ADMIN                                  │
│ - Control total del sistema                  │
│ - Gestionar todos los usuarios               │
│ - Ver todos los reportes                     │
│ - Acceso a configuración avanzada            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ ADMIN                                        │
│ - Gestionar usuarios (excepto admins)        │
│ - Cambiar estado de incidentes               │
│ - Ver todas las estadísticas                 │
│ - Enviar notificaciones                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ CITIZEN                                      │
│ - Reportar incidentes                        │
│ - Ver solo sus reportes                      │
│ - Subir evidencia                            │
│ - Recibir notificaciones                     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ POLICE                                       │
│ - Ver incidentes en su zona                  │
│ - Actualizar estados                        │
│ - Crear reportes internos                    │
│ - Comunicación con ciudadanos                │
└──────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Reportar Incidente

```
FRONTEND                        BACKEND                    BASE DE DATOS
   │                              │                              │
   │  1. Usuario completa form    │                              │
   │─────────────────────────────>│                              │
   │                              │                              │
   │                              │  2. Valida datos             │
   │                              │                              │
   │                              │  3. Guarda Incident          │
   │                              │──────────────────────────────>│
   │                              │                              │
   │                              │  4. ID generado              │
   │                              │<──────────────────────────────│
   │  5. Adjunta fotos/videos     │                              │
   │─────────────────────────────>│                              │
   │                              │                              │
   │                              │  6. Guarda Media             │
   │                              │──────────────────────────────>│
   │                              │                              │
   │                              │  7. Envía notificación       │
   │                              │  por WebSocket               │
   │<─────────────────────────────│                              │
   │                              │  8. Registra en ActivityLog  │
   │                              │──────────────────────────────>│
   │                              │                              │
   │  9. Muestra confirmación     │                              │
   │                              │                              │
```

---

## 🔌 WebSocket (Tiempo Real)

### Conexión de Cliente

```
1. Cliente conecta: /ws/incidents
2. STOMP subscription a: /topic/incidents
3. Las notificaciones se distribuyen automáticamente

Ejemplo de evento:
{
  "type": "INCIDENT_CREATED",
  "incident": {...},
  "timestamp": "2026-01-15T10:30:00",
  "recipients": ["ADMIN", "POLICE"]
}
```

### Flujos de WebSocket

```
NUEVO INCIDENTE
┌──────────┐
│ Ciudadano│
│ reporta  │
└────┬─────┘
     │ HTTP POST /api/v1/incidents
     ↓
┌──────────────────────────┐
│ IncidentService          │
│ - Guarda en BD           │
│ - Envio evento WebSocket │
└────┬─────────────────────┘
     │ WebSocket /topic/incidents
     ↓
┌──────────────────────────┐
│ Clientes conectados      │
│ - Admins                 │
│ - Policía en zona        │
│ - Reportante             │
└──────────────────────────┘
     │
     ↓ Alerta + Notificación


ACTUALIZACIÓN DE ESTADO
┌──────────┐
│ Policía  │
│ actualiza│
└────┬─────┘
     │ PUT /api/v1/incidents/{id}
     ↓
┌──────────────────────────┐
│ IncidentService          │
│ - Cambia estado en BD    │
│ - Envio evento           │
└────┬─────────────────────┘
     │ WebSocket /topic/incidents
     ↓
┌──────────────────────────┐
│ Usuarios interesados     │
│ - Reportante             │
│ - Personal asignado      │
│ - Supervisores           │
└──────────────────────────┘
```

---

## 📊 Modelo de Datos Simplificado

```
User
├── id PK
├── email (unique)
├── password (hashed)
├── firstName
├── lastName
├── role_id FK
├── isActive
├── createdAt
└── updatedAt

Role
├── id PK
├── name (SUPER_ADMIN, ADMIN, CITIZEN, POLICE)
└── description

Incident
├── id PK
├── title
├── description
├── latitude / longitude
├── address
├── incidentType_id FK
├── priority_id FK
├── status_id FK
├── reporter_id FK (User)
├── assignedTo_id FK (User)
├── isAnonymous
├── reportDate
├── resolvedDate
└── createdAt

IncidentType: Robo, Hurto, Vandalismo...
PriorityLevel: Baja, Media, Alta, Emergencia
Status: Pendiente, En Proceso, Resuelto...

Media
├── id PK
├── incident_id FK
├── mediaType (photo/video)
├── filePath
├── fileSize
└── uploadedBy_id FK

CAI
├── id PK
├── name
├── latitude / longitude
├── zone
├── phone
├── commander

Notification
├── id PK
├── user_id FK
├── incident_id FK
├── title
├── message
├── isRead
└── createdAt
```

---

## 🚀 Patrones de Diseño Usados

### 1. **MVC (Model-View-Controller)**
- Controllers manejan requests
- Services contienen lógica
- Repositories acceden a datos

### 2. **DTO Pattern (Data Transfer Object)**
- Separate entities from API responses
- RequestDTO para inputs validados
- ResponseDTO para outputs consistentes

### 3. **Repository Pattern**
- Spring Data JPA Repositories
- Abstraction de acceso a datos
- Named queries para consultas complejas

### 4. **Dependency Injection**
- @Autowired for Spring beans
- Constructor injection recomendado
- IoC container maneja ciclo de vida

### 5. **Observer Pattern**
- WebSocket events
- Event listeners
- Notificaciones en tiempo real

### 6. **Singleton Pattern**
- Servicios únicos
- Configuraciones globales
- CacheManager, ThreadPool

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      1. Checkout code
      2. Setup Java 17
      3. Build Backend: mvn clean install
      4. Run Backend Tests
      5. Build Frontend: mvn clean install
      6. Run Frontend Tests
      7. Docker Build
      8. Push to Registry
      9. Deploy (optional)
```

---

## 📈 Performance & Scaling

### Optimizaciones Implementadas

1. **Base de Datos**
   - Índices en campos frecuentes
   - Connection pooling (HikariCP)
   - Lazy loading de relaciones

2. **Cache**
   - Redis para sesiones JWT
   - @Cacheable en servicios frecuentes
   - TTL configurable

3. **Frontend**
   - Componentes reutilizables
   - Carga lazy de pantallas
   - Imágenes optimizadas

---

**Versión**: 1.0.0 | **Actualizado**: Enero 2026
