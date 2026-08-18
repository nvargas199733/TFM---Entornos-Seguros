# Frontend Ciudadano - Entornos Seguros

Aplicación web Single Page Application (SPA) desarrollada en **React 19** y **Vite 8** para el reporte, seguimiento geolocalizado de incidentes ciudadanos y consulta de Centros de Atención Inmediata (CAI) en Bogotá.

---

## 1. Alcance Funcional

- **Autenticación y Perfil:** Registro de usuarios ciudadanos, inicio de sesión seguro mediante JWT y consulta de perfil (`/login`, `/register`, `/profile`).
- **Creación de Incidentes:** Formulario de reporte con selección de tipo, geolocalización, dirección de referencia, descripción y adjunto de evidencias multimedia por URL (`/report`).
- **Seguimiento de Reportes:** Listado de incidentes propios (`/reports`) con detalle y visualización de la línea de tiempo de cambios de estado (`/reports/:id`).
- **Mapa Ciudadano de CAIs:** Visualización geoespacial interactiva con Leaflet / OpenStreetMap limitada al área de Bogotá, con cálculo del CAI más cercano mediante PostGIS y trazado de rutas (`/mapa-cai`).

---

## 2. Scripts Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:5173
npm run dev

# Compilar paquete de producción
npm run build

# Previsualizar el build de producción
npm run preview
```

---

## 3. Integración con Microservicios

Toda la comunicación con el backend está desacoplada en la capa `src/services/`:
- **`authService.js`:** Consumo de `auth-user-service` (:8081) para registro, login y perfil.
- **`incidentService.js`:** Consumo de `incident-service` (:8082) para creación de incidentes, evidencias y consulta de reportes.
- **`caiService.js`:** Consumo de `auth-user-service` (:8081) para catálogo de CAIs y CAI más cercano.

---

**Entornos Seguros** | Frontend Ciudadano - 2026
