# Estructura del Proyecto

Este archivo describe la organizacion canonica del repositorio.

## Carpetas principales

```text
TFM---Entornos-Seguros/
|- frontend-ciudadano/              # Frontend ciudadano (activo)
|- frontend-policia-admin/          # Frontend policia/admin (activo)
|- docs/                   # Documentacion tecnica
|- docker-compose.yml      # Infraestructura local
|- README.md               # Entrada principal
|- CONTRIBUTING.md         # Guia de colaboracion
```

## Estructura esperada backend final

```text
backend/
|- auth-user-service/
|- incident-service/
|- police-report-service/
```

## Politica de carpetas

- Desarrollo nuevo en frontend-ciudadano y frontend-policia-admin.
- Toda decision de arquitectura y setup debe reflejarse en docs/.