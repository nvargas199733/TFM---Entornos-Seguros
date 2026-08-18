# Estructura Canónica del Proyecto - Entornos Seguros

Este documento define la estructura de directorios, la organización de capas y las reglas de límites arquitectónicos del monorepo **Entornos Seguros**.

---

## 1. Árbol de Directorios del Monorepo

```text
TFM---Entornos-Seguros/
├── backend/                               # Monorepo Backend Multi-módulo (Java 21 + Gradle)
│   ├── auth-user-service/                 # Microservicio de Identidad, Cuentas y CAI (:8081)
│   │   └── src/main/java/co/entornosseguros/auth/
│   │       ├── config/                    # SecurityConfig, JwtAuthFilter, CorsConfig
│   │       ├── domain/                    # JPA Entities (UserEntity, RoleEntity, CaiEntity)
│   │       ├── repository/                # Spring Data JPA Repositories
│   │       ├── service/                   # Lógica de negocio y AuthService
│   │       └── web/                       # REST Controllers y DTOs (Auth, Users, Cai)
│   ├── incident-service/                  # Microservicio de Gestión de Incidentes (:8082)
│   │   └── src/main/java/co/entornosseguros/incident/
│   │       ├── domain/                    # Entities (Incident, Evidence, StatusHistory, etc.)
│   │       ├── repository/                # JPA Repositories con filtros por usuario
│   │       ├── service/                   # IncidentService y Bootstrap de Catálogos
│   │       └── web/                       # REST Controllers (Incidents, Evidences, Catalogs)
│   ├── police-report-service/             # Microservicio de Informes Oficiales (:8083)
│   │   └── src/main/java/co/entornosseguros/police/
│   │       ├── domain/                    # PoliceReportEntity
│   │       ├── repository/                # PoliceReportRepository
│   │       ├── service/                   # PoliceReportService
│   │       └── web/                       # PoliceReportController y DTOs
│   ├── build.gradle                       # Configuración de compilación común
│   ├── settings.gradle                    # Inclusión de submódulos Gradle
│   └── gradlew / gradlew.bat              # Gradle Wrapper
│
├── frontend-ciudadano/                    # SPA Ciudadana en React 19 + Vite (:5173)
│   ├── src/
│   │   ├── components/                    # Header, Footer, Hero, ReportFlow, Modales
│   │   ├── pages/                         # Home, Login, Register, Report, ReportsList, Detail, Map, Profile
│   │   ├── services/                      # Clientes API (authService, incidentService, caiService)
│   │   └── styles/                        # Estilos CSS modulares
│   ├── package.json
│   └── vite.config.js
│
├── frontend-policia-admin/                # SPA Operativa y Administrativa en React 19 + Vite (:5174)
│   ├── src/
│   │   ├── components/                    # ProtectedRoute, UsersTable, UserReportCard, OfficialReportView, StatsCard
│   │   ├── pages/                         # HomePolice, ReportsPolice, UserReportDetail, CreatePoliceReport, MapPolice,
│   │   │                                  # AdminHome, CreateUserAdmin, ManageUsersAdmin, AdminIncidents, AdminIncidentDetail
│   │   ├── services/                      # Clientes API (authService, policeApi, adminUsersApi)
│   │   └── styles/                        # Estilos CSS modulares (dark mode, layout, mapa)
│   ├── package.json
│   └── vite.config.js
│
├── docs/                                  # Documentación Técnica Formal del Sistema
│   ├── ARCHITECTURE.md                    # Blueprint de arquitectura, esquemas DB y patrones
│   ├── API.md                             # Especificación de contratos REST y DTOs
│   ├── MICROSERVICES_ENDPOINTS.md         # Catálogo detallado de endpoints con ejemplos cURL
│   └── SETUP.md                           # Guía integral de instalación y configuración
│
├── database/                              # Esquemas SQL de referencia
├── docker-compose.yml                     # Orquestación de PostgreSQL 16, Redis 7 y pgAdmin 4
├── PROJECT_STRUCTURE.md                   # Este documento
├── PROJECT_SUMMARY.md                     # Resumen ejecutivo y estado del proyecto
├── CONTRIBUTING.md                        # Guía de contribución y flujo Git
└── README.md                              # Entrada principal del repositorio
```

---

## 2. Límites y Reglas de Arquitectura

Para mantener la robustez, mantenibilidad y facilitar el trabajo tanto de desarrolladores como de agentes GenAI:

1. **Aislamiento de Microservicios:**
   - Cada microservicio en `backend/` es un proyecto Spring Boot autónomo.
   - No existen dependencias de código cruzadas entre microservicios (no hay subproyectos comunes ni dependencias de Gradle entre servicios de negocio).
   - Toda interacción entre dominios ocurre a través de peticiones HTTP REST con JSON.

2. **Aislamiento de Datos (*Schema-per-Service*):**
   - Cada microservicio solo lee y escribe en su propio esquema de PostgreSQL (`auth_user`, `incident`, `police_report`).
   - Quedan estrictamente prohibidos los JOINs o constraints de integridad referencial física (`FOREIGN KEY`) entre tablas de distintos esquemas.
   - Las entidades JPA utilizan referencias lógicas (`Long idUsuario`, `Long idIncidente`).

3. **Aislamiento de Frontends:**
   - `frontend-ciudadano` y `frontend-policia-admin` son aplicaciones independientes con ciclos de vida y empaquetado propios.
   - Toda llamada a endpoints del backend debe residir en la capa `src/services/` de cada frontend, aislando la lógica de transporte HTTP de los componentes visuales de React.

4. **Preservación de Estilos y Experiencia Visual:**
   - Los componentes UI deben mantener su encapsulamiento CSS.
   - Las modificaciones funcionales en la integración con APIs deben preservar los estilos, paletas de color, microanimaciones y accesibilidad.

---

**Entornos Seguros** | Estructura Canónica del Proyecto - 2026