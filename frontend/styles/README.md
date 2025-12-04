# Carpeta CSS - TapStyle

Esta carpeta contiene todos los archivos CSS personalizados del proyecto TapStyle, separados del HTML para mejor organización y mantenibilidad.

## Archivos CSS

### 1. `main.css`
**Uso:** Páginas principales del sitio (index.html, index_cliente.html)

**Estilos incluidos:**
- Fuente Inter de Google Fonts
- Fondo base del sitio (#f7f7f7)
- Estilos generales del body

**Archivos HTML que lo usan:**
- `index.html`
- `index_cliente.html`

---

### 2. `login.css`
**Uso:** Página de login y registro

**Estilos incluidos:**
- Fuente Inter de Google Fonts
- Fondo degradado premium (linear-gradient)
- Estilos específicos para formularios de autenticación

**Archivos HTML que lo usan:**
- `login.html`

---

### 3. `dashboard.css`
**Uso:** Todos los dashboards y paneles administrativos

**Estilos incluidos:**
- Fuente Inter de Google Fonts
- Fondo de panel (#f8f9fa)
- Estilos de sidebar (250px de ancho, fijo)
- Estilos de contenido principal
- Estilos para contenido scrollable
- Estilos para modales (pop-ups)

**Archivos HTML que lo usan:**
- `dashboard_superadmin.html`
- `dashboard_admin_negocio.html`
- `dashboard_vendedor.html`
- `comisiones_pagos.html`
- `configuracion_sistema.html`
- `crud_producto.html`
- `finanzas_pagos.html`
- `gestion_empleados.html`
- `gestion_empresas.html`
- `gestion_modulos_empresa.html`
- `reportes_globales.html`
- `roles_permisos.html`
- `ventas_pedidos.html`

---

## Estructura del Proyecto

```
TapStyle/
└── mockups/
    ├── css/
    │   ├── main.css          # Estilos principales
    │   ├── login.css         # Estilos de login
    │   ├── dashboard.css     # Estilos de dashboards
    │   └── README.md         # Este archivo
    ├── index.html
    ├── login.html
    ├── dashboard_*.html
    └── ... (otros archivos HTML)
```

## Notas Importantes

- Todos los archivos HTML ahora referencian archivos CSS externos
- Se eliminó todo el CSS embebido de las etiquetas `<style>`
- Tailwind CSS sigue cargándose desde CDN
- Los estilos personalizados complementan a Tailwind CSS

## Mantenimiento

Para agregar nuevos estilos:
1. Identifica qué tipo de página es
2. Agrega los estilos al archivo CSS correspondiente
3. Si es un nuevo tipo de página, considera crear un nuevo archivo CSS

Para modificar estilos existentes:
1. Localiza el archivo CSS apropiado
2. Modifica los estilos necesarios
3. Los cambios se aplicarán automáticamente a todas las páginas que usen ese archivo
