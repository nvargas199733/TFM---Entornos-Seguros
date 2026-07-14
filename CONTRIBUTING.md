# Guia de Contribucion

Este proyecto mantiene dos frontends React y un backend de microservicios Java.

## Flujo recomendado

1. Crear rama desde main.
2. Hacer cambios pequenos y verificables.
3. Ejecutar validaciones locales.
4. Abrir Pull Request con contexto funcional y tecnico.

## Convenciones de ramas

- feature/nombre-corto
- fix/nombre-corto
- docs/nombre-corto
- refactor/nombre-corto
- chore/nombre-corto

## Convencion de commits

- feat: nueva funcionalidad
- fix: correccion de bug
- docs: cambios de documentacion
- refactor: mejora interna sin cambio funcional
- test: pruebas nuevas o ajustadas
- chore: tareas de mantenimiento

## Checklist antes de PR

- El cambio compila o ejecuta localmente.
- No rompe rutas, vistas ni estilos existentes.
- No introduce dependencias innecesarias.
- Actualiza documentacion cuando aplica.
- Incluye notas de prueba manual o automatizada.

## Criterios de revision

- Correccion funcional.
- Riesgo de regresion visual.
- Legibilidad y mantenibilidad.
- Coherencia con arquitectura por microservicios.