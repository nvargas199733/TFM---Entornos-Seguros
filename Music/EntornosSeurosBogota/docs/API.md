# 📖 API REST - Entornos Seguros Bogotá

## 🔐 Autenticación

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@entornosseguros.gov.co",
  "password": "contraseña"
}

Response 200 OK:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": {
    "id": 1,
    "email": "usuario@entornosseguros.gov.co",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CITIZEN"
  }
}
```

### Registrarse
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "nuevo@entornosseguros.gov.co",
  "password": "SecurePass123!",
  "firstName": "Carlos",
  "lastName": "Gómez",
  "phone": "+57-300-1234567"
}

Response 201 Created:
{
  "id": 5,
  "email": "nuevo@entornosseguros.gov.co",
  "message": "Usuario registrado exitosamente"
}
```

### Refresh Token
```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response 200 OK:
{
  "token": "nuevo_jwt_token"
}
```

---

## 📍 Incidentes

### Listar Todos los Incidentes
```http
GET /api/v1/incidents?page=0&size=10&sort=createdAt,desc
Authorization: Bearer {JWT_TOKEN}

Query Parameters:
- page: número de página (0-indexed)
- size: registros por página
- sort: campo y dirección de ordenamiento
- status: filtrar por estado
- type: filtrar por tipo
- priority: filtrar por prioridad

Response 200 OK:
{
  "content": [
    {
      "id": 1,
      "title": "Robo en calle principal",
      "description": "Se reporta robo de celular...",
      "latitude": 4.7169,
      "longitude": -74.0470,
      "address": "Cra 13 No. 56-12",
      "incidentType": "Robo",
      "priority": "Alta",
      "status": "En Proceso",
      "reporter": {
        "id": 3,
        "email": "ciudadano@entornosseguros.gov.co"
      },
      "assignedTo": {
        "id": 4,
        "email": "policia@entornosseguros.gov.co"
      },
      "evidenceCount": 2,
      "isAnonymous": false,
      "reportDate": "2026-01-15T10:30:00Z",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-01-15T11:45:00Z"
    },
    // ... más incidentes
  ],
  "totalElements": 247,
  "totalPages": 25,
  "currentPage": 0,
  "hasNext": true,
  "hasPrevious": false
}
```

### Obtener Detalle de Incidente
```http
GET /api/v1/incidents/{id}
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "id": 1,
  "title": "Robo en calle principal",
  "description": "Se reporta robo de celular...",
  "latitude": 4.7169,
  "longitude": -74.0470,
  "address": "Cra 13 No. 56-12",
  "city": "Bogotá",
  "incidentType": "Robo",
  "priority": "Alta",
  "status": "En Proceso",
  "reporter": {...},
  "assignedTo": {...},
  "isAnonymous": false,
  "reportDate": "2026-01-15T10:30:00Z",
  "resolvedDate": null,
  "evidenceCount": 2,
  "media": [
    {
      "id": 1,
      "mediaType": "photo",
      "fileName": "evidence_1.jpg",
      "fileSize": 1024000,
      "uploadedBy": {...},
      "createdAt": "2026-01-15T10:35:00Z"
    }
  ],
  "comments": [
    {
      "id": 1,
      "user": {...},
      "comment": "Revisamos la zona...",
      "createdAt": "2026-01-15T11:00:00Z"
    }
  ],
  "activityLog": [...]
}
```

### Crear Nuevo Incidente
```http
POST /api/v1/incidents
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "title": "Vandalismo en parque",
  "description": "Pintadas en árboles del parque...",
  "latitude": 4.7200,
  "longitude": -74.0500,
  "address": "Parque El Retiro",
  "incidentType": "Vandalismo",
  "priority": "Media",
  "isAnonymous": false
}

Response 201 Created:
{
  "id": 248,
  "title": "Vandalismo en parque",
  ...
  "status": "Pendiente",
  "createdAt": "2026-01-15T14:20:00Z"
}
```

### Actualizar Incidente
```http
PUT /api/v1/incidents/{id}
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "status": "Resuelto",
  "priority": "Media",
  "assignedTo": 4
}

Response 200 OK:
{
  "id": 1,
  "title": "Robo en calle principal",
  "status": "Resuelto",
  "resolvedDate": "2026-01-15T15:00:00Z",
  "updatedAt": "2026-01-15T15:00:00Z"
}
```

### Eliminar Incidente (Solo ADMIN)
```http
DELETE /api/v1/incidents/{id}
Authorization: Bearer {JWT_TOKEN}

Response 204 No Content
```

---

## 👥 Usuarios (Admin Only)

### Listar Usuarios
```http
GET /api/v1/users?page=0&size=10&role=CITIZEN
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "content": [
    {
      "id": 1,
      "email": "admin@entornosseguros.gov.co",
      "firstName": "Administrador",
      "lastName": "Sistema",
      "phone": "+57-300-0000000",
      "role": "SUPER_ADMIN",
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "totalElements": 45,
  "totalPages": 5
}
```

### Crear Usuario
```http
POST /api/v1/users
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "email": "nuevo.policia@entornosseguros.gov.co",
  "password": "TempPass123!",
  "firstName": "Pedro",
  "lastName": "López",
  "phone": "+57-300-7654321",
  "role": "POLICE"
}

Response 201 Created:
{
  "id": 50,
  "email": "nuevo.policia@entornosseguros.gov.co",
  "role": "POLICE",
  "createdAt": "2026-01-15T16:00:00Z"
}
```

### Actualizar Usuario
```http
PUT /api/v1/users/{id}
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "firstName": "Pedro",
  "lastName": "López Martinez",
  "phone": "+57-300-9999999",
  "isActive": true
}

Response 200 OK:
{
  "id": 50,
  "email": "nuevo.policia@entornosseguros.gov.co",
  "firstName": "Pedro",
  "lastName": "López Martinez",
  "updatedAt": "2026-01-15T16:30:00Z"
}
```

### Desactivar/Eliminar Usuario
```http
DELETE /api/v1/users/{id}
Authorization: Bearer {JWT_TOKEN}

Response 204 No Content
```

---

## 📊 Analíticas

### Heatmap de Incidentes
```http
GET /api/v1/analytics/heatmap?days=30&type=Robo
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "heatmapData": [
    {
      "latitude": 4.7169,
      "longitude": -74.0470,
      "intensity": 15
    },
    {
      "latitude": 4.7200,
      "longitude": -74.0500,
      "intensity": 8
    }
  ],
  "period": "Últimos 30 días",
  "totalPoints": 42
}
```

### Incidentes por Zona
```http
GET /api/v1/analytics/incidents-by-zone?days=30
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "zones": [
    {
      "zone": "Kennedy",
      "total": 23,
      "percentage": 32.5
    },
    {
      "zone": "Suba",
      "total": 18,
      "percentage": 25.7
    }
  ]
}
```

### Tendencias Temporales
```http
GET /api/v1/analytics/trends?days=30&groupBy=day
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "chartData": [
    {"date": "2026-01-01", "count": 12},
    {"date": "2026-01-02", "count": 15},
    ...
  ],
  "avgPerDay": 8.5,
  "peak": "2026-01-15"
}
```

### Estadísticas Generales
```http
GET /api/v1/analytics/summary
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "todayIncidents": 12,
  "thisWeek": 87,
  "thisMonth": 342,
  "resolvedPercent": 78.5,
  "avgResolutionHours": 4.2,
  "topIncidentType": "Robo",
  "criticalCount": 3
}
```

---

## 📍 Geolocalización

### Obtener CAI Más Cercano
```http
GET /api/v1/cai/nearest?latitude=4.7169&longitude=-74.0470&radius=5000
Authorization: Bearer {JWT_TOKEN}

Query Parameters:
- latitude: latitud del usuario (obligatorio)
- longitude: longitud del usuario (obligatorio)
- radius: radio en metros (default: 5000)

Response 200 OK:
{
  "nearest": {
    "id": 1,
    "name": "CAI Chapinero",
    "latitude": 4.7169,
    "longitude": -74.0470,
    "address": "Cra 13 No. 56-12",
    "zone": "Chapinero",
    "phone": "(601)232-1234",
    "commander": "Tte. Rodríguez M.",
    "distance": 0.8,
    "estimatedTime": "3 min"
  },
  "nearby": [
    {
      "id": 2,
      "name": "CAI Kennedy",
      "distance": 4.5,
      "estimatedTime": "12 min"
    }
  ]
}
```

### Listar Todos los CAI
```http
GET /api/v1/cai?active=true
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "caiList": [
    {
      "id": 1,
      "name": "CAI Chapinero",
      "latitude": 4.7169,
      "longitude": -74.0470,
      "zone": "Chapinero",
      "phone": "(601)232-1234",
      "isActive": true
    }
  ],
  "total": 8
}
```

---

## 🔔 Notificaciones

### Obtener Notificaciones del Usuario
```http
GET /api/v1/notifications?unread=true&page=0&size=20
Authorization: Bearer {JWT_TOKEN}

Query Parameters:
- unread: solo no leídas (default: false)
- page: número de página
- size: registros por página

Response 200 OK:
{
  "content": [
    {
      "id": 1,
      "title": "Nuevo incidente en tu zona",
      "message": "Se reportó un robo a 500m de tu ubicación",
      "type": "INCIDENT_CREATED",
      "isRead": false,
      "incident": {...},
      "createdAt": "2026-01-15T14:20:00Z"
    }
  ],
  "unreadCount": 5,
  "totalElements": 127
}
```

### Marcar Notificación como Leída
```http
PUT /api/v1/notifications/{id}/read
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "id": 1,
  "isRead": true,
  "readAt": "2026-01-15T14:25:00Z"
}
```

### Marcar Todas como Leídas
```http
PUT /api/v1/notifications/read-all
Authorization: Bearer {JWT_TOKEN}

Response 200 OK:
{
  "markedAsRead": 5
}
```

---

## ⚠️ Errores y Códigos HTTP

### Códigos de Éxito
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado
- `204 No Content` - Solicitud exitosa sin contenido

### Códigos de Error
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (email duplicado)
- `422 Unprocessable Entity` - Validación fallida
- `500 Internal Server Error` - Error del servidor

### Estructura de Error
```json
{
  "timestamp": "2026-01-15T14:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "El campo email es requerido",
  "path": "/api/v1/users",
  "details": {
    "email": "Este campo no puede estar vacío"
  }
}
```

---

## 🔐 Headers Requeridos

```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
Accept: application/json
```

---

## 📚 Autenticación Completada

Todos los endpoints excepto login/register requieren:
- Header `Authorization: Bearer {JWT_TOKEN}`
- El token debe estar vigente (24 horas)
- Si expira, usar `refresh-token`

---

**Versión API**: v1.0.0 | **Última actualización**: Enero 2026
