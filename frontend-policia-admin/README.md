# Frontend Policia/Admin

Aplicacion React + Vite para operacion policial y administracion.

## Alcance funcional

- Bandeja de incidentes.
- Detalle y seguimiento de casos.
- Generacion de reporte policial.
- Gestion de usuarios (rol admin).
- Panel con indicadores y estadisticas operativas.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Integracion backend

Servicios objetivo:
- auth-user-service
- incident-service
- police-report-service

La integracion debe hacerse por capa de servicios para no afectar componentes visuales ni estilos.
