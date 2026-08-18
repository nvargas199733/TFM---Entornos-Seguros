# Arquitectura del Sistema - Entornos Seguros

Este documento define la arquitectura técnica formal, la estrategia de persistencia desacoplada, el modelo de datos por microservicio y los patrones de integración del proyecto **Entornos Seguros**.

---

## 1. Visión General y Justificación

El sistema adopta una **arquitectura de microservicios** en el backend combinada con **dos aplicaciones frontend desacopladas en React (Vite)**. El objetivo es maximizar la modularidad, permitir el desarrollo y evolución independiente de cada dominio funcional, y garantizar una clara separación de responsabilidades.

```mermaid
graph TD
    subgraph ClientTier ["Capa de Presentación (Frontends SPA)"]
        FC["frontend-ciudadano<br/>(Puerto 5173)<br/>Rol: USUARIO"]
        FPA["frontend-policia-admin<br/>(Puerto 5174)<br/>Roles: POLICIA / ADMIN"]
    end

    subgraph ServiceTier ["Capa de Microservicios (Spring Boot 3 / Java 21)"]
        AUTH["auth-user-service<br/>(Puerto 8081)<br/>Dominio: Identidad, Roles, CAI"]
        INC["incident-service<br/>(Puerto 8082)<br/>Dominio: Incidentes, Evidencias, Estados"]
        POL["police-report-service<br/>(Puerto 8083)<br/>Dominio: Informes y Atención Policial"]
    end

    subgraph DataTier ["Capa de Persistencia (PostgreSQL 16)"]
        S_AUTH[("Esquema: auth_user")]
        S_INC[("Esquema: incident")]
        S_POL[("Esquema: police_report")]
    end

    FC -->|REST / JWT| AUTH
    FC -->|REST / JWT| INC
    FPA -->|REST / JWT| AUTH
    FPA -->|REST / JWT| INC
    FPA -->|REST / JWT| POL

    AUTH --- S_AUTH
    INC --- S_INC
    POL --- S_POL
```

---

## 2. Estrategia de Persistencia: *Schema-per-Service*

En arquitecturas distribuidas, el patrón canónico es **Database-per-Service**, donde cada microservicio es dueño exclusivo de sus datos y los expone únicamente a través de su API REST.

Para el contexto del Trabajo de Fin de Máster (TFM) y equilibrando rigor arquitectónico con viabilidad operativa:
- Se implementa una **única instancia de PostgreSQL**.
- La separación lógica estricta se logra mediante **esquemas dedicados (*schemas*)**:
  1. `auth_user` para `auth-user-service`
  2. `incident` para `incident-service`
  3. `police_report` para `police-report-service`

### Reglas de Desacoplamiento de Datos
- **Sin Foreign Keys Físicas Inter-Esquema:** Las tablas del esquema `incident` o `police_report` **nunca** definen constraints `FOREIGN KEY` hacia tablas del esquema `auth_user`.
- **Referencias Lógicas:** La asociación entre un incidente y su creador se realiza mediante el campo `id_usuario` (identificador lógico `BIGINT`). La asociación entre un reporte policial y el agente se realiza mediante `id_usuario_policia`.
- **Independencia Evolutiva:** Cada servicio puede alterar sus tablas o migrar a una base de datos física independiente sin afectar la integridad relacional de los demás.

---

## 3. Modelo de Datos por Esquema

### 3.1. Esquema `auth_user` (auth-user-service)

Representa el dominio de identidad, autenticación, control de acceso y catálogo geográfico de referencia.

```mermaid
erDiagram
    ROL ||--o{ USUARIO : "asigna a"
    
    ROL {
        bigint id_rol PK
        varchar nombre "ADMINISTRADOR, POLICIA, USUARIO"
        varchar descripcion
    }

    USUARIO {
        bigint id_usuario PK
        bigint id_rol FK
        varchar cedula UK
        varchar nombres
        varchar apellidos
        varchar telefono
        varchar correo UK
        varchar contrasena_hash
        boolean activo
        timestamp fecha_creacion
    }

    CAI {
        bigint id_cai PK
        varchar nombre
        varchar direccion
        varchar localidad
        varchar telefono
        varchar foto_url
        numeric latitud
        numeric longitud
        geometry geom "Point EPSG:4326"
        boolean activo
    }
```

#### Descripción de Entidades:
- **`rol`:** Catálogo de perfiles funcionales del sistema (`ADMINISTRADOR`, `POLICIA`, `USUARIO`).
- **`usuario`:** Cuentas autenticables con credenciales encriptadas mediante BCrypt y control de estado activo/inactivo.
- **`cai`:** *(Excepción controlada)* Catálogo estático de Centros de Atención Inmediata con capacidades geoespaciales (PostGIS).

---

### 3.2. Esquema `incident` (incident-service)

Constituye el núcleo operativo ciudadano para el reporte, categorización, evidencias y ciclo de vida del incidente.

```mermaid
erDiagram
    TIPO_INCIDENTE ||--o{ INCIDENTE : "clasifica"
    ESTADO_INCIDENTE ||--o{ INCIDENTE : "establece estado"
    INCIDENTE ||--o{ EVIDENCIA_INCIDENTE : "contiene"
    INCIDENTE ||--o{ HISTORIAL_ESTADO_INCIDENTE : "registra trazabilidad"
    ESTADO_INCIDENTE ||--o{ HISTORIAL_ESTADO_INCIDENTE : "asocia estado"

    TIPO_INCIDENTE {
        bigint id_tipo_incidente PK
        varchar nombre
        text descripcion
        boolean estado_activo
        timestamp created_at
        timestamp updated_at
    }

    ESTADO_INCIDENTE {
        bigint id_estado_incidente PK
        varchar nombre "PENDIENTE, EN_ATENCION, ATENDIDO, DESCARTADO"
        varchar descripcion
    }

    INCIDENTE {
        bigint id_incidente PK
        bigint id_usuario "Referencia lógica a auth_user.usuario"
        bigint id_tipo_incidente FK
        bigint id_estado_incidente FK
        numeric latitud
        numeric longitud
        varchar direccion_referencia
        text descripcion
        timestamp fecha_reporte
        timestamp fecha_actualizacion
    }

    EVIDENCIA_INCIDENTE {
        bigint id_evidencia_incidente PK
        bigint id_incidente FK
        varchar tipo_archivo "imagen, video, documento"
        varchar url_archivo
        varchar nombre_archivo
        timestamp fecha_carga
    }

    HISTORIAL_ESTADO_INCIDENTE {
        bigint id_historial_estado_incidente PK
        bigint id_incidente FK
        bigint id_estado_incidente FK
        bigint id_usuario_responsable "Referencia lógica a auth_user.usuario"
        varchar observacion
        timestamp fecha_cambio
    }
```

---

### 3.3. Esquema `police_report` (police-report-service)

Registra la formalización oficial de la intervención policial sobre un caso reportado.

```mermaid
erDiagram
    REPORTE_POLICIAL {
        bigint id_reporte_policial PK
        bigint id_incidente "Referencia lógica a incident.incidente"
        bigint id_usuario_policia "Referencia lógica a auth_user.usuario"
        boolean hubo_heridos
        text descripcion_atencion
        timestamp fecha_reporte
        timestamp fecha_actualizacion
    }
```

---

## 4. Flujo y Ciclo de Vida del Incidente

El siguiente diagrama de secuencia ilustra la interacción integral entre los actores, los dos frontends y los tres microservicios:

```mermaid
sequenceDiagram
    autonumber
    actor Ciudadano
    actor Policia
    actor Administrador
    participant FC as frontend-ciudadano (:5173)
    participant FPA as frontend-policia-admin (:5174)
    participant Auth as auth-user-service (:8081)
    participant Inc as incident-service (:8082)
    participant Pol as police-report-service (:8083)

    %% Registro de Incidente
    Ciudadano->>FC: Reportar incidente + Evidencia URL
    FC->>Inc: POST /api/v1/incidents (JWT Ciudadano)
    Inc-->>FC: 201 Created (idIncidente)
    FC->>Inc: POST /api/v1/incidents/{id}/evidences
    Inc-->>FC: 201 Created

    %% Consulta Policial y Mapa
    Policia->>FPA: Abrir Mapa Operativo (/mapa)
    FPA->>Inc: GET /api/v1/incidents (JWT Policia)
    Inc-->>FPA: 200 OK (Lista de incidentes)
    Note over FPA: Valida límites Bogotá<br/>Aplica filtros locales

    %% Atención Policial
    Policia->>FPA: Atender caso (/reportes/:id/generar-informe)
    FPA->>Pol: POST /api/v1/police-reports (idIncidente, descripcionAtencion, huboHeridos)
    Pol-->>FPA: 201 Created
    FPA->>Inc: PATCH /api/v1/incidents/{id}/status (estado: ATENDIDO)
    Inc-->>FPA: 200 OK

    %% Auditoría Administrativa
    Administrador->>FPA: Inspeccionar incidente (/admin/incidentes/:id)
    FPA->>Inc: GET /api/v1/incidents/{id}
    FPA->>Inc: GET /api/v1/incidents/{id}/evidences
    FPA->>Pol: GET /api/v1/police-reports/by-incident/{id}
    FPA-->>Administrador: Renderiza reporte ciudadano + evidencias + informe policial oficial
```

---

## 5. Seguridad y Autenticación

### 5.1. Mecanismo de Autenticación
1. **Emisión:** `auth-user-service` valida credenciales (email + contraseña con BCrypt) y emite un JWT firmado con algoritmo HMAC-SHA256 (`HS256` / `HS512`).
2. **Payload del Token:** Contiene `sub` (email), `userId` (idUsuario), `role` (`ROLE_ADMIN`, `ROLE_POLICIA`, `ROLE_USUARIO`), `iat` y `exp`.
3. **Propagación:** Cada petición HTTP del cliente incluye la cabecera `Authorization: Bearer <token>`.
4. **Validación Stateless:** Cada microservicio valida la firma del token utilizando la misma clave secreta compartida (`JWT_SECRET`).

### 5.2. Aislamiento de Rutas en Frontend (`ProtectedRoute`)
En `frontend-policia-admin`, las rutas se protegen mediante validación estricta de rol:
- **`POLICIA`:** Acceso a `/`, `/reportes`, `/mapa`, `/reportes/:id`, `/reportes/:id/generar-informe`.
- **`ADMIN`:** Acceso a `/admin`, `/admin/crear-usuario`, `/admin/gestion-usuarios`, `/admin/editar-usuario/:id`, `/admin/incidentes`, `/admin/incidentes/:id`.
- **Redirección:** Intentos de acceso cruzado redirigen al dashboard correspondiente del rol sin ejecutar peticiones no autorizadas.

---

## 6. Decisiones Arquitectónicas Notables

### D-01: Catálogo de CAIs en `auth_user`
- **Contexto:** El TFM modela 3 microservicios principales. Se requería un catálogo de 156+ CAIs de Bogotá para soporte geográfico.
- **Decisión:** Alojar la tabla `cai` en el esquema `auth_user` y exponerla desde `auth-user-service`.
- **Justificación:** Los datos de CAI son estáticos, de solo lectura, y no pertenecen al dominio de incidentes ni de reportes policiales. Crear un cuarto microservicio añadiría sobrecarga operativa innecesaria para el alcance del proyecto.

### D-02: Bounding Box Geográfico de Bogotá
- **Contexto:** El mapa ciudadano y el mapa operativo policial deben restringirse a la jurisdicción de Bogotá D.C.
- **Decisión:** Configurar límites geográficos estrictos (`BOGOTA_BOUNDS = [[4.47, -74.25], [4.83, -74.0]]`) con `maxBoundsViscosity=1.0` en Leaflet.
- **Justificación:** Previene navegación fuera de la zona de interés operativo e identifica incidentes con coordenadas inválidas o externas mediante avisos contextuales accesibles.

---

**Entornos Seguros** | Documentación de Arquitectura Técnica - 2026