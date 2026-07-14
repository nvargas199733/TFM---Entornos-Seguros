# Arquitectura del Sistema

## Vision general

La solucion se organiza en dos frontends React y un backend de tres microservicios Java con persistencia desacoplada por esquema.

## Componentes

### Frontends

- ciudadano: experiencia para usuarios ciudadanos.
- frontend-react: experiencia para policia y administracion.

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
- La migracion a TypeScript se realiza de forma progresiva, priorizando servicios y modelos para reducir riesgo visual.