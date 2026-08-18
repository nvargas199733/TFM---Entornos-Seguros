# Frontend Policía y Administrador - Entornos Seguros

Aplicación web SPA desarrollada en **React 19** y **Vite 8** para la gestión operativa policial y la administración institucional del sistema **Entornos Seguros**.

---

## 1. Arquitectura de Roles y Rutas Protegidas

El acceso y las rutas están estrictamente segregados mediante el componente `ProtectedRoute.jsx` según el rol autenticado:

### 1.1. Rol `POLICIA`
- **`/`:** Dashboard policial de inicio con métricas operativas y accesos rápidos.
- **`/reportes`:** Bandeja general de incidentes reportados con filtros dinámicos.
- **`/mapa`:** Mapa operativo interactivo (Leaflet) acotado a Bogotá (`BOGOTA_BOUNDS`), con marcadores codificados por tipo y estado, filtros en tiempo real (estado, tipo, semana actual) y popups con navegación directa.
- **`/reportes/:id`:** Vista de detalle del incidente con carga de evidencias reales remotas y soporte de fallback visual ante imágenes caídas.
- **`/reportes/:id/generar-informe`:** Formulario oficial de informe policial que registra la atención en `police-report-service` y actualiza automáticamente el estado del caso a `ATENDIDO` en `incident-service`.

### 1.2. Rol `ADMIN`
- **`/admin`:** Panel administrativo principal con KPIs globales de incidentes y accesos a gestión.
- **`/admin/gestion-usuarios`:** Tabla de usuarios con búsqueda, filtro por rol, paginación, edición y activación/desactivación lógica de cuentas.
- **`/admin/crear-usuario`:** Formulario de registro administrativo para crear agentes de policía o administradores.
- **`/admin/editar-usuario/:id`:** Edición de datos y roles de usuarios.
- **`/admin/incidentes`:** Bandeja administrativa de incidentes.
- **`/admin/incidentes/:id`:** Vista integral de auditoría que combina el reporte ciudadano, la galería de evidencias reales y el informe oficial de policía.

---

## 2. Scripts Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:5174
npm run dev

# Compilar paquete de producción
npm run build

# Previsualizar el build de producción
npm run preview
```

---

## 3. Integración con Microservicios

Toda la comunicación con el backend está encapsulada en la capa `src/services/`:
- **`authService.js`:** Gestión de sesión JWT en `localStorage` (`entornos_auth`), normalización de roles y logout centralizado.
- **`policeApi.js`:** Consumo de `incident-service` (:8082) y `police-report-service` (:8083) con cabeceras `Authorization: Bearer <token>` para incidentes, evidencias e informes policiales.
- **`adminUsersApi.js`:** Consumo de endpoints administrativos de `auth-user-service` (:8081) protegidos con `ROLE_ADMIN` para el CRUD de usuarios.

---

**Entornos Seguros** | Frontend Policía y Administrador - 2026
