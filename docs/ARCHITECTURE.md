# Arquitectura del Sistema

## Vision general

La solucion se organiza en dos frontends React y un backend de tres microservicios Java con persistencia desacoplada por esquema.

## Componentes

### Frontends

- ciudadano: experiencia para usuarios ciudadanos.
- policia-admin: experiencia para policia y administracion.

### Backend (microservicios)

1. auth-user-service
- autenticacion, usuarios y roles.

2. incident-service
- creacion, clasificacion, seguimiento y estados de incidentes.

3. police-report-service
- formalizacion de la atencion policial sobre incidentes.

## Persistencia

- Motor: PostgreSQL.
- Patron: schema per service.
- Esquemas:
  - auth_user
  - incident
  - police_report

## Integracion entre servicios

- Cada servicio es propietario de sus tablas.
- Relaciones entre dominios se representan con identificadores logicos.
- No hay acceso directo entre tablas de microservicios diferentes.

## Seguridad y acceso

- JWT para autenticacion.
- Autorizacion por roles en backend.
- Validacion de entrada por endpoint.
- CORS controlado por entorno.

## Integracion frontend-backend

- Los frontends consumen APIs REST por microservicio.
- La capa de integracion se concentra en src/services.
- El consumo de servicios en ambos frontends ya cubre flujos principales de autenticacion, incidentes, CAI, reporte policial y gestion de usuarios.

## Catálogos Auxiliares

### CAI (Centros de Atención Inmediata)

**Definición:** Catálogo de estaciones de policía mantenido como referencia en el esquema `auth_user.cai` (156+ registros).

**Propósito:** Proporcionar información geoespacial de CAI para funcionalidades de mapeo y ubicación de ciudadanos.

**Exposición:** Endpoints de solo lectura en `auth-user-service`:
- `GET /api/v1/cai` - Listar todos los CAI activos
- `GET /api/v1/cai/{id}` - Obtener CAI por ID
- `GET /api/v1/cai/nearest?lat=X&lng=Y` - Encontrar CAI más cercano usando índice geoespacial (PostGIS)

**Excepción controlada:** Aunque el documento PDF de arquitectura establece tres microservicios independientes (auth_user, incident, police_report), el catálogo CAI se mantiene en `auth_user` por:
1. Ser datos estáticos y de solo lectura (no requiere transacciones distribuidas)
2. Su naturaleza de catálogo de referencia (no propiedades del dominio de incidentes ni reportes)
3. Compartir contexto de autenticación y usuario

Esta decisión reduce la sobrecarga de un servicio dedicado sin comprometer la arquitectura de microservicios.