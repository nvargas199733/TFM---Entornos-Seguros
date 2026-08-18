# Guía de Contribución y Buenas Prácticas - Entornos Seguros

Este documento establece las directrices y estándares de ingeniería de software para colaborar en el desarrollo y mantenimiento del proyecto **Entornos Seguros**, tanto para desarrolladores humanos como para agentes GenAI.

---

## 1. Principios de Arquitectura Inviolables

1. **Persistencia *Schema-per-Service*:**
   - Cada microservicio es dueño exclusivo de su esquema de PostgreSQL (`auth_user`, `incident`, `police_report`).
   - Queda terminantemente prohibido crear `FOREIGN KEY` físicas entre tablas de esquemas diferentes o ejecutar consultas directas entre esquemas.
   - Las relaciones inter-servicio deben modelarse siempre mediante **identificadores lógicos** (`Long idUsuario`, `Long idIncidente`).

2. **Aislamiento en Frontends:**
   - Toda llamada HTTP a microservicios debe residir en la capa `src/services/`. Nunca se debe invocar `fetch()` directamente dentro de los componentes visuales de React.
   - Preservar el encapsulamiento de estilos CSS y la coherencia visual (paleta institucional, modo oscuro, microanimaciones y accesibilidad).

3. **Seguridad y Control de Acceso:**
   - Todo endpoint de negocio debe protegerse adecuadamente con roles de Spring Security (`hasRole('ADMIN')`, `hasRole('POLICIA')`, `hasRole('USUARIO')`).
   - Las rutas del frontend deben respetar la segregación de `ProtectedRoute.jsx`.

---

## 2. Flujo de Trabajo Git y Ramas

### Convención de Ramas
- `feature/<nombre-descriptivo>`: Nuevas funcionalidades.
- `fix/<nombre-descriptivo>`: Corrección de errores o bugs.
- `docs/<nombre-descriptivo>`: Actualizaciones de documentación.
- `refactor/<nombre-descriptivo>`: Refactorizaciones internas de código.
- `chore/<nombre-descriptivo>`: Tareas de mantenimiento o configuración.

### Convención de Commits (Conventional Commits)
```text
<tipo>(<ámbito opcional>): <descripción concisa en imperativo>

Ejemplos:
- feat(map): agregar límites geográficos de Bogotá en mapa policial
- fix(evidences): corregir fallback visual en detalle administrativo
- docs(api): actualizar contratos REST de incident-service
```

---

## 3. Checklist de Verificación Antes de Integrar Cambios

Antes de dar por completado un cambio o abrir un Pull Request:

- [ ] **Backend Compila:** `cd backend && ./gradlew build -x test` ejecuta con éxito (código de salida 0).
- [ ] **Frontends Compilan:** `npm run build` en `frontend-ciudadano` y `frontend-policia-admin` finaliza sin errores de bundling.
- [ ] **Límites de Esquema Respetados:** No se agregaron llaves foráneas cruzadas entre esquemas de PostgreSQL.
- [ ] **Sin Mocks Innecesarios:** Los flujos implementados consumen las APIs reales de los microservicios.
- [ ] **Documentación Actualizada:** Se reflejaron los cambios en los archivos `.md` correspondientes dentro de `docs/`.

---

**Entornos Seguros** | Guía de Contribución - 2026