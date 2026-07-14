# Frontend Ciudadano

Aplicacion React + Vite para reporte ciudadano de incidentes.

## Alcance funcional

- Registro e inicio de sesion.
- Creacion y consulta de reportes.
- Visualizacion de tipos de incidente.
- Perfil ciudadano.
- Mapa y servicios de apoyo.

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

La comunicacion con API debe concentrarse en src/services para reducir riesgo de regresiones visuales.
