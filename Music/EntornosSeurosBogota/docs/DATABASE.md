# 🗄️ DISEÑO DE BASE DE DATOS

## 📋 Diagrama ER (Entity-Relationship)

```
┌─────────────────────────────┐
│         USERS               │
├─────────────────────────────┤
│ • id (PK)                   │
│ • email (UNIQUE)            │
│ • password (hashed)         │
│ • first_name                │
│ • last_name                 │
│ • phone                     │
│ • is_active                 │
│ • role_id (FK)          ───┐│
│ • created_at                │││
│ • updated_at                │││
└──────────────┬──────────────┘│
               │               │
               │       ┌───────▼──────────────┐
               │       │     ROLES            │
               │       ├──────────────────────┤
               │       │ • id (PK)            │
               │       │ • name (UNIQUE)      │
               │       │ • description        │
               └───────┤ • created_at         │
                       └──────────────────────┘

┌─────────────────────────────┐
│      INCIDENTS              │
├─────────────────────────────┤
│ • id (PK)                   │
│ • title                     │
│ • description               │
│ • latitude                  │
│ • longitude                 │
│ • address                   │
│ • incident_type_id (FK) ───┐
│ • priority_id (FK)      ──┐│
│ • status_id (FK)       ───┼┼─┐
│ • reporter_id (FK)     ──┐│││
│ • assigned_to_id (FK) ───┼┼┼┼┐
│ • is_anonymous          │││││
│ • report_date           │││││
│ • resolved_date         │││││
│ • created_at            │││││
│ • updated_at            │││││
└──────────────┬──────────┘│││││
               │           │││││
     ┌─────────┴───┐   ┌───┴────┐   ┌─────────┐   ┌──────────┐
     │             │   │        │   │         │   │          │
┌────▼────┐ ┌─────▼───┴───┐ ┌──▼────────┐ ┌─▼──────────┐
│ USERS   │ │INCIDENT_TYPE│ │PRIORITY   │ │  STATUS    │
│ (PK)    │ │             │ │           │ │            │
└─────────┘ │PRIORITY_    │ └───────────┘ └────────────┘
            │LEVEL        │
            │ TYPES       │
            └─────────────┘

┌──────────────────────────────┐
│          MEDIA               │
├──────────────────────────────┤
│ • id (PK)                    │
│ • incident_id (FK)      ────┐
│ • media_type                │
│ • file_path                 │
│ • file_size                 │
│ • uploaded_by_id (FK)       │
│ • created_at                │
└──────────────┬───────────────┘
               │
        ┌──────▼─────────┐
        │ INCIDENTS      │
        │ (FK)           │
        └────────────────┘

┌──────────────────────────────┐
│         CAI                  │
├──────────────────────────────┤
│ • id (PK)                    │
│ • name                       │
│ • latitude                   │
│ • longitude                  │
│ • address                    │
│ • zone                       │
│ • phone                      │
│ • commander                  │
│ • is_active                  │
│ • created_at                 │
│ • updated_at                 │
└──────────────────────────────┘

┌──────────────────────────────┐
│    NOTIFICATIONS             │
├──────────────────────────────┤
│ • id (PK)                    │
│ • user_id (FK)          ────┐
│ • incident_id (FK)      ──┐ │
│ • title                   │ │
│ • message                 │ │
│ • is_read                 │ │
│ • notification_type       │ │
│ • created_at              │ │
└──────────────┬────────────┘ │
               │               │
        ┌──────▼──┐   ┌───────▼─┐
        │ USERS   │   │INCIDENTS│
        └─────────┘   └─────────┘

┌──────────────────────────────┐
│    ACTIVITY_LOG              │
├──────────────────────────────┤
│ • id (PK)                    │
│ • user_id (FK)          ────┐
│ • incident_id (FK)      ──┐ │
│ • action                  │ │
│ • old_value               │ │
│ • new_value               │ │
│ • ip_address              │ │
│ • created_at              │ │
└──────────────┬────────────┘ │
               │               │
        ┌──────▼──┐   ┌───────▼─┐
        │ USERS   │   │INCIDENTS│
        └─────────┘   └─────────┘

┌──────────────────────────────┐
│  INCIDENT_COMMENTS           │
├──────────────────────────────┤
│ • id (PK)                    │
│ • incident_id (FK)      ────┐
│ • user_id (FK)          ──┐ │
│ • comment                 │ │
│ • created_at              │ │
│ • updated_at              │ │
└──────────────┬────────────┘ │
               │               │
        ┌──────▼──┐   ┌───────▼─┐
        │ USERS   │   │INCIDENTS│
        └─────────┘   └─────────┘
```

---

## 📊 Esquema Detallado

### Tabla: USERS
Almacena información de todos los usuarios del sistema.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- bcrypt hash
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email LIKE '%@%')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_role_id ON users(role_id);
```

**Campos Importantes:**
- `email`: Identificador único, utilizado en login
- `password`: Hash bcrypt de la contraseña (nunca en texto plano)
- `role_id`: Determina permisos y acceso
- `is_active`: Soft delete (no se elimina, solo se desactiva)

---

### Tabla: INCIDENTS
Central del sistema - registra todos los reportes.

```sql
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    incident_type_id INTEGER NOT NULL REFERENCES incident_types(id),
    priority_id INTEGER NOT NULL REFERENCES priority_levels(id),
    status_id INTEGER NOT NULL REFERENCES status(id),
    reporter_id INTEGER NOT NULL REFERENCES users(id),
    assigned_to_id INTEGER REFERENCES users(id),
    is_anonymous BOOLEAN DEFAULT false,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP,
    evidence_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_coordinates CHECK (
        latitude BETWEEN -90 AND 90 AND 
        longitude BETWEEN -180 AND 180
    )
);

-- Índices para búsquedas geoespaciales
CREATE INDEX idx_incidents_location ON incidents(latitude, longitude);
CREATE INDEX idx_incidents_status_id ON incidents(status_id);
CREATE INDEX idx_incidents_type_id ON incidents(incident_type_id);
CREATE INDEX idx_incidents_priority_id ON incidents(priority_id);
CREATE INDEX idx_incidents_report_date ON incidents(report_date DESC);
```

**Campos Importantes:**
- `latitude / longitude`: Ubicación exacta del incidente
- `incident_type_id`: Clasificación (robo, hurto, etc.)
- `priority_id`: Nivel de urgencia
- `status_id`: Estado actual del reporte
- `reporter_id`: Usuario que reportó
- `assigned_to_id`: Autoridad asignada (NULL si no asignado)
- `is_anonymous`: Puede reportar sin identificación

---

### Tabla: MEDIA
Almacena referencias a fotos y videos adjuntos.

```sql
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video')),
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,  -- en bytes
    uploaded_by_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 52428800)  -- 50MB max
);

CREATE INDEX idx_media_incident_id ON media(incident_id);
```

**Campos Importantes:**
- `media_type`: Solo 'photo' o 'video'
- `file_path`: Ruta relativa en servidor o URL en cloud
- `file_size`: Para limitar uploads (50MB máximo)
- Cascada DELETE: Si se elimina incident, se eliminan todos los media

---

### Tabla: CAI
Centros de Atención Inmediata (policía).

```sql
CREATE TABLE cai (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(255) NOT NULL,
    zone VARCHAR(100),
    phone VARCHAR(20),
    commander VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cai_is_active ON cai(is_active);
CREATE INDEX idx_cai_zone ON cai(zone);
```

---

### Tabla: NOTIFICATIONS
Historial de notificaciones push/WebSocket.

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    notification_type VARCHAR(50),  -- 'INCIDENT_CREATED', 'STATUS_CHANGED', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

### Tabla: ACTIVITY_LOG
Auditoría de cambios para compliance.

```sql
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),  -- IPv6 compatible
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
```

---

## 🔍 Consultas Comunes

### Encontrar incidentes sin asignar en la zona del usuario
```sql
SELECT i.* 
FROM incidents i
WHERE i.status_id = (SELECT id FROM status WHERE name = 'Pendiente')
  AND i.assigned_to_id IS NULL
  AND ST_DWithin(
    ST_MakePoint(i.longitude, i.latitude)::geography,
    ST_MakePoint(:userLat, :userLon)::geography,
    5000  -- 5km
  )
ORDER BY i.priority_id DESC, i.created_at ASC;
```

### Heatmap de incidentes por zona
```sql
SELECT 
    i.latitude,
    i.longitude,
    COUNT(*) as incident_count,
    it.name as type
FROM incidents i
JOIN incident_types it ON i.incident_type_id = it.id
WHERE i.report_date >= NOW() - INTERVAL '30 days'
GROUP BY i.latitude, i.longitude, it.name
ORDER BY incident_count DESC;
```

### Estadísticas de usuario
```sql
SELECT 
    u.id,
    u.email,
    COUNT(CASE WHEN i.status_id = 1 THEN 1 END) as pending,
    COUNT(CASE WHEN i.status_id = 2 THEN 1 END) as in_process,
    COUNT(CASE WHEN i.status_id = 3 THEN 1 END) as resolved,
    AVG(EXTRACT(EPOCH FROM (i.resolved_date - i.report_date))) as avg_resolution_time
FROM users u
LEFT JOIN incidents i ON u.id = i.assigned_to_id AND u.role_id = 4
GROUP BY u.id, u.email;
```

---

## 🔐 Restricciones de Seguridad

### Políticas de Row Level Security (RLS)

```sql
-- Los ciudadanos solo pueden ver sus propios reportes
CREATE POLICY citizen_incidents_policy ON incidents
    FOR SELECT USING (
        (SELECT role_id FROM users WHERE id = current_user_id) = 3 
        AND reporter_id = current_user_id
    );

-- Los policías ven incidentes de su zona
CREATE POLICY police_incidents_policy ON incidents
    FOR ALL USING (
        (SELECT role_id FROM users WHERE id = current_user_id) = 4 
        AND assigned_to_id = current_user_id
    );
```

---

## 📈 Optimizaciones de Performance

### 1. Índices Estratégicos
- Todos los FK tienen índices
- Timestamps para queries temporales
- Geolocalización (latitude + longitude juntos)

### 2. Particionamiento (Futuro)
```sql
-- Para muy alto volumen
CREATE TABLE incidents_2026_01 PARTITION OF incidents
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### 3. Materialized Views (Estadísticas)
```sql
CREATE MATERIALIZED VIEW incident_stats_daily AS
SELECT 
    DATE(report_date) as date,
    incident_type_id,
    priority_id,
    COUNT(*) as total,
    COUNT(CASE WHEN status_id = 3 THEN 1 END) as resolved
FROM incidents
GROUP BY DATE(report_date), incident_type_id, priority_id;

CREATE INDEX idx_incident_stats_daily ON incident_stats_daily(date DESC);
```

---

## 🔄 Migraciones

### Versión 1 (Actual)
- Schema inicial completo
- Todas las tablas
- Índices y constraints

### Versión 2 (Ready)
- Datos iniciales de rol y tipos de incidentes
- Usuarios de demostración
- CAI de Bogotá

### Versionamiento con Flyway
```
src/main/resources/db/migration/
├── V1__Initial_Schema.sql
├── V2__Insert_Initial_Data.sql
├── V3__Add_...
└── V4__Modify_...
```

---

## 🧹 Mantenimiento

### Backup
```bash
# Full backup
pg_dump -U entornos_user entornos_seguros_db > backup.sql

# Restaurar
psql -U entornos_user entornos_seguros_db < backup.sql
```

### Limpieza
```sql
-- Eliminar notificaciones antiguas
DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '90 days';

-- Archiv

ar incidentes resueltos
-- (copiar a tabla histórica si existe)
```

---

**Versión**: 1.0.0 | **Actualizado**: Enero 2026
