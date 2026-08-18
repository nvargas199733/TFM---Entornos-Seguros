# Resumen Ejecutivo y Estado del Proyecto - Entornos Seguros

**Proyecto:** Entornos Seguros (Trabajo de Fin de Máster - TFM)  
**Dominio:** Seguridad Ciudadana, Geolocalización, Gestión y Atención de Incidentes  
**Estado:** Integración Funcional End-to-End Completada

---

## 1. Visión y Objetivo

**Entornos Seguros** es una plataforma distribuida diseñada para conectar a la ciudadanía con las autoridades policiales y los organismos administrativos en la gestión ágil, transparente y georreferenciada de incidentes de seguridad ciudadana en Bogotá D.C.

### Capacidades Centrales:
- **Canal Ciudadano:** Registro de reportes con geolocalización, clasificación por tipo, carga de evidencias (imágenes/URLs), seguimiento del ciclo de vida del caso y consulta de Centros de Atención Inmediata (CAI) cercanos mediante PostGIS.
- **Canal Policial:** Mapa operativo en tiempo real acotado a Bogotá con filtros dinámicos, inspección de evidencias reales y generación de informes oficiales que formalizan la atención y actualizan el estado a `ATENDIDO`.
- **Canal Administrativo:** Control de acceso basado en roles (RBAC), gestión y CRUD de usuarios (policías y administradores) y auditoría global de incidentes con reportes policiales asociados.

---

## 2. Alineación Arquitectónica con el TFM

El sistema implementa fielmente los principios de la memoria técnica de arquitectura:

1. **Arquitectura de Microservicios:**
   - `auth-user-service` (:8081): Identidad, usuarios, roles y catálogo geográfico de CAIs.
   - `incident-service` (:8082): Gestión de incidentes, evidencias, historial y catálogos.
   - `police-report-service` (:8083): Registro formal de la atención policial.
2. **Estrategia de Persistencia *Schema-per-Service*:**
   - Una única base de datos PostgreSQL 16 con esquemas lógicamente aislados: `auth_user`, `incident` y `police_report`.
   - Propiedad exclusiva de datos por servicio y desacoplamiento mediante identificadores lógicos (`idUsuario`, `idIncidente`), sin llaves foráneas físicas cruzadas.
3. **Frontends Desacoplados:**
   - `frontend-ciudadano` (:5173) para rol `USUARIO`.
   - `frontend-policia-admin` (:5174) para roles `POLICIA` y `ADMINISTRADOR`.

---

## 3. Estado Actual de Implementación e Integración

| Hito Funcional / Técnico | Estado | Detalle de Implementación |
| :--- | :---: | :--- |
| **Backend Multi-módulo Gradle** | ✅ Completo | 3 microservicios en Java 21 + Spring Boot 3 con Gradle Wrapper funcional. |
| **Autenticación JWT & RBAC** | ✅ Completo | Registro, login, emisión de tokens, validación en backend y enrutamiento protegido en frontends. |
| **Flujo Ciudadano de Incidentes** | ✅ Completo | Creación de reporte con evidencias URL, consulta de mis reportes y detalle con historial de estados. |
| **Catálogo & Mapa de CAIs** | ✅ Completo | Catálogo de 156+ CAIs en `auth_user`, búsqueda del más cercano con PostGIS y mapa Leaflet ciudadano. |
| **Bandeja y Detalle Policial** | ✅ Completo | Listado con filtros, detalle con evidencias reales remotas y soporte de fallback visual. |
| **Atención e Informe Policial** | ✅ Completo | Formulario de informe oficial que registra en `police-report-service` y actualiza el estado del incidente a `ATENDIDO` en `incident-service`. |
| **Mapa Operativo Policial** | ✅ Completo | Mapa Leaflet con marcadores por tipo/estado, filtros por periodo/semana, delimitación a Bogotá (`BOGOTA_BOUNDS`) y overlays de estado vacío/carga. |
| **Gestión Administrativa de Usuarios** | ✅ Completo | Listado de usuarios, búsqueda, filtrado, creación con rol asignable (`POLICIA`/`ADMIN`) y desactivación lógica con `ROLE_ADMIN`. |
| **Detalle de Incidentes Admin** | ✅ Completo | Vista unificada de reporte ciudadano, evidencias reales e informe policial emitido. |

---

## 4. Oportunidades de Evolución y Mejoras Futuras

1. **Migraciones Versionadas de Base de Datos:** Incorporar Flyway o Liquibase en los microservicios para despliegues reproducibles en entornos de producción.
2. **Capa de CAI en el Mapa Policial:** Agregar un toggle en `MapPolice.jsx` para visualizar opcionalmente las estaciones de CAI junto a los incidentes operativos.
3. **Gestión de Almacenamiento Directo de Evidencias:** Integración con servicios de almacenamiento de objetos (Amazon S3 / MinIO) para carga directa de binarios multimedia además de URLs externas.
4. **Migración Progresiva a TypeScript:** Tipado estricto de DTOs y componentes React para robustecer los contratos en tiempo de compilación.

---

**Entornos Seguros** | Resumen Ejecutivo del Proyecto - 2026