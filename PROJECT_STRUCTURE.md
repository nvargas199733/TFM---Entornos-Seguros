# Estructura del Proyecto

Este archivo describe la organizacion canonica del repositorio.

## Carpetas principales

```text
TFM---Entornos-Seguros/
|- frontend-ciudadano/              # Frontend ciudadano (activo)
|- frontend-policia-admin/          # Frontend policia/admin (activo)
|- backend/                         # Backend monorepo (activo)
|- docs/                   # Documentacion tecnica
|- docker-compose.yml      # Infraestructura local
|- README.md               # Entrada principal
|- CONTRIBUTING.md         # Guia de colaboracion
```

## Estructura esperada backend final

```text
backend/
|- build.gradle
|- settings.gradle
|- gradle.properties
|- auth-user-service/
|- incident-service/
|- police-report-service/
```

## Estructura recomendada de monorepo

```text
TFM---Entornos-Seguros/
|- frontend-ciudadano/
|- frontend-policia-admin/
|- backend/
|- docs/
|- infra/
```

## Politica de carpetas

- Desarrollo nuevo en frontend-ciudadano y frontend-policia-admin.
- Toda decision de arquitectura y setup debe reflejarse en docs/.