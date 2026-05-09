# 🎨 GUÍA DE DISEÑO UI/UX

## 🎭 Paleta de Colores

### Colores Primarios
```
Azul Oscuro Institucional
┌─────────────────────────────┐
│ #001F3F                     │ RGB(0, 31, 63)
│ Uso: Headers, Sidebar, CTAs │
└─────────────────────────────┘

Azul Turquesa Tecnológico
┌─────────────────────────────┐
│ #00BCD4                     │ RGB(0, 188, 212)
│ Uso: Botones primarios,     │
│ Accents, Hover states       │
└─────────────────────────────┘
```

### Colores Secundarios
```
Blanco Limpio
┌─────────────────────────────┐
│ #FFFFFF                     │ Fondos principales
└─────────────────────────────┘

Gris Suave
┌─────────────────────────────┐
│ #F5F5F5                     │ Fondos secundarios
│ #E8E8E8                     │ Bordes y divisores
├─────────────────────────────┤
│ #999999                     │ Texto deshabilitado
│ #666666                     │ Texto secundario
│ #333333                     │ Texto principal
└─────────────────────────────┘
```

### Colores de Estado
```
✅ Éxito/Resuelto
┌─────────────────────────────┐
│ #27AE60 (Verde)             │ RGB(39, 174, 96)
│ Usado en: Incidentes        │
│ cerrados, botones positivos │
└─────────────────────────────┘

⚠️ Advertencia/Pendiente
┌─────────────────────────────┐
│ #F39C12 (Naranja)           │ RGB(243, 156, 18)
│ Usado en: Estados medios,   │
│ alertas, precaución         │
└─────────────────────────────┘

❌ Peligro/Emergencia
┌─────────────────────────────┐
│ #E74C3C (Rojo)              │ RGB(231, 76, 60)
│ Usado en: Emergencias,      │
│ botones destructivos        │
└─────────────────────────────┘

🔴 Emergencia Máxima
┌─────────────────────────────┐
│ #8B0000 (Rojo Oscuro)       │ RGB(139, 0, 0)
│ Usado en: Alertas críticas  │
└─────────────────────────────┘

ℹ️ Información
┌─────────────────────────────┐
│ #3498DB (Azul Claro)        │ RGB(52, 152, 219)
│ Usado en: Información,      │
│ tips, etiquetas             │
└─────────────────────────────┘
```

---

## 📝 Tipografía

### Fuentes Recomendadas

**Poppins** - Títulos y Headings
```
Weights: 700 (Bold)
Sizes: 28px (H1), 24px (H2), 20px (H3), 18px (H4)
Ejemplo: "Reporta incidentes de seguridad en tiempo real"
```

**Inter** - Subtítulos y Botones
```
Weights: 600 (SemiBold), 500 (Medium)
Sizes: 16px, 14px, 12px
Ejemplo: "Módulo de reportes"
```

**Montserrat** - Cuerpo de Texto
```
Weights: 400 (Regular), 500 (Medium)
Sizes: 14px (Normal), 12px (Small)
Ejemplo: "Descripción detallada del incidente..."
```

**JetBrains Mono** - Código (solo si aplica)
```
Monospace para datos técnicos
```

---

## 🎯 Componentes UI

### Botones

#### Botón Primario (Azul Turquesa)
```
Estado Normal:
- Background: #00BCD4
- Text Color: #FFFFFF
- Padding: 12px 24px
- Border Radius: 6px
- Font: Inter 600, 14px
- Shadow: dropshadow(3px, rgba(0, 188, 212, 0.3))

Estado Hover:
- Background: #00A8B8
- Shadow: dropshadow(5px, rgba(0, 188, 212, 0.5))
- Transition: 200ms

Estado Pressed:
- Background: #0095A0
- Shadow: dropshadow(2px, rgba(0, 188, 212, 0.2))

Estado Deshabilitado:
- Background: #CCCCCC
- Opacity: 0.6
- Cursor: not-allowed
```

#### Botón Secundario (Azul Oscuro)
```
Similar al primario pero:
- Background: #001F3F
- Hover: #002855
```

#### Botón Peligroso (Rojo)
```
- Background: #E74C3C
- Hover: #C0392B
```

#### Botón Ghost (Transparente)
```
- Background: transparent
- Border: 2px solid #00BCD4
- Text Color: #00BCD4
- Hover: Background #F5F5F5
```

### Campos de Entrada

```
Default:
- Background: #FFFFFF
- Border: 1px solid #E8E8E8
- Border Radius: 6px
- Padding: 12px 16px
- Font: Montserrat 400, 14px

Focus:
- Border: 2px solid #00BCD4
- Box Shadow: 0 0 0 3px rgba(0, 188, 212, 0.1)

Error:
- Border: 2px solid #E74C3C
- Background: rgba(231, 76, 60, 0.05)

Placeholder:
- Color: #999999
- Font Style: italic
```

### Cards/Paneles

```
Card Base:
- Background: #FFFFFF
- Border: 1px solid #E8E8E8
- Border Radius: 8px
- Padding: 20px
- Shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
- Transition: transform 200ms, box-shadow 200ms

Card Hover:
- Shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
- Transform: translateY(-2px)

Card Active:
- Background: #F5F5F5
- Border: 2px solid #00BCD4
```

### Badges/Etiquetas

```
Badge Success:
- Background: #E8F5E9
- Color: #27AE60
- Border Radius: 12px
- Padding: 4px 12px
- Font: Inter 600, 11px

Badge Warning:
- Background: #FFF3E0
- Color: #F39C12

Badge Danger:
- Background: #FFEBEE
- Color: #E74C3C

Badge Info:
- Background: #E3F2FD
- Color: #3498DB
```

### Tablas

```
Header Row:
- Background: #F5F5F5
- Border Bottom: 2px solid #00BCD4
- Font: Inter 600, 12px
- Padding: 12px

Data Rows:
- Background: #FFFFFF
- Border Bottom: 1px solid #E8E8E8
- Padding: 12px
- Alternating rows: muy ligero gris si es necesario

Hover Row:
- Background: #FAFAFA
- Cursor: pointer (si es seleccionable)

Hover Cell:
- Background: rgba(0, 188, 212, 0.05)
```

---

## ✨ Efectos y Animaciones

### Glassmorphism
```
/* Efecto de vidrio frosted */
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px rgba(0, 31, 63, 0.1);
```

### Transiciones Suaves
```
/* Botones y links */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Cambios de color */
transition: background-color 150ms ease-out;

/* Transformaciones */
transition: transform 200ms ease-in-out;
```

### Animaciones Keyframe

#### Fade In
```
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
animation: fadeIn 300ms ease-out;
```

#### Slide Up
```
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
animation: slideUp 400ms cubic-bezier(0.4, 0, 0.2, 1);
```

#### Pulse (para alertas)
```
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
animation: pulse 2s ease-in-out infinite;
```

#### Spin (para loaders)
```
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
animation: spin 1s linear infinite;
```

### Microanimaciones

#### Hover de botón
```
- Scale: 1.02
- Duration: 100ms
- Easing: ease-out
```

#### Click de botón
```
- Scale: 0.98
- Duration: 50ms
```

#### Hover de link
```
- Underline animation
- Color fade
```

---

## 📱 Layout Responsive

### Breakpoints
```
Mobile: < 480px
Small Tablet: 480px - 768px
Tablet: 768px - 1024px
Desktop: 1024px - 1440px
Large Desktop: > 1440px
```

### Sidebar
```
Desktop:
- Width: 280px
- Position: Fixed, left
- Visible siempre

Tablet/Mobile:
- Width: 100%
- Position: Absolute
- Toggle con hamburger menu
- Z-index: 1000
```

### Grid
```
Desktop: 12 columnas
Tablet: 8 columnas
Mobile: 4 columnas
```

---

## 🎬 Pantallas Principales

### 1. Login
```
Layout:
- Fondo con patrón de Bogotá
- Card centrada con formulario
- Logo arriba
- Campos: Email, Contraseña
- "Olvidé contraseña" link
- Button "Inicia Sesión"
- Loader durante autenticación
```

### 2. Dashboard
```
Layout:
- Sidebar izquierda (navegación)
- Header superior (logout, notificaciones)
- Main area:
  * KPI cards (últimos 30 días)
  * Gráficas de tendencias
  * Últimos incidentes
- Responsive: Sidebar colapsable en móvil
```

### 3. Mapa Interactivo
```
Componentes:
- Mapa completo (90% del espacio)
- Panel lateral con controles
- Filtros por tipo y prioridad
- Markers animados
- Marcador de ubicación del usuario
- Información popup en click
- Panel de CAI cercanos
```

### 4. Reportar Incidente
```
Formulario:
- Wizard de 3 pasos:
  1. Tipo y descripción
  2. Geolocalización
  3. Evidencia (fotos/videos)
- Validación en tiempo real
- Progress indicator
- Preview antes de enviar
- Confirmación al finalizar
```

### 5. Detalle de Incidente
```
Secciones:
- Header: Título, estado badge, prioridad
- Información básica: Tipo, ubicación, fecha
- Descripción completa
- Media gallery (fotos/videos)
- Timeline de actualizaciones
- Formulario de comentarios
- Botones de acción (si es autoridad)
```

---

## 🌓 Dark Mode (Futuro)

```
Conversión de colores:
- Blanco #FFFFFF → Gris Oscuro #1E1E1E
- Gris #F5F5F5 → Gris Muy Oscuro #2A2A2A
- Texto oscuro → Blanco o Gris Claro
- Mantener azules (suficientemente vibrantes)
```

---

## ♿ Accesibilidad

### WCAG 2.1 Level AA Compliance

```
Contraste:
- Normal text: 4.5:1 (AA)
- Large text: 3:1 (AA)
- Graphics: 3:1 (AA)

Focus States:
- Visible keyboard focus (TODO)
- Focus order: logical

Icons:
- Con aria-labels
- Siempre acompañados de texto

Forms:
- Labels explícitos
- Error messages claros
- Campos requeridos marcados
```

---

## 📐 Espacios (Spacing System)

```
Base unit: 8px

Escala:
- xs: 4px (muy pequeño)
- sm: 8px (pequeño)
- md: 16px (médium - DEFAULT)
- lg: 24px (grande)
- xl: 32px (muy grande)
- 2xl: 48px (extra grande)
- 3xl: 64px (enorme)

Ejemplo:
- Padding botón: 12px 24px (md horizontal, lg vertical)
- Gap flexbox: 16px (md)
- Margin sección: 48px (xl)
```

---

## 🎭 Estados de Componentes

### Incidente States
```
🔵 Pendiente (Azul claro)
🟡 En Proceso (Naranja)
🟢 Resuelto (Verde)
⚫ Cerrado (Gris)
🔴 Emergencia (Rojo)
```

### Botón States
```
Normal → Hover → Active → Disabled
```

### Form Field States
```
Empty → Focused → Filled → Error → Success
```

---

## 📏 Guía de Marca

### Logo
- Respetar proporción
- Espacio mínimo alrededor: 10px
- Tamaño mínimo: 32px

### Tipografía Marca
- Siempre "Entornos Seguros Bogotá"
- Puede ser "ESB" en contextos pequeños
- En azul #001F3F preferentemente

### Tone of Voice
- Professional pero accesible
- Proactivo (animamos a reportar)
- Empático (entendemos el problema)
- Directo y claro

---

**Versión**: 1.0.0 | **Actualizado**: Enero 2026
