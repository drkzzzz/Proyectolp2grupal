# Arquitectura Admin-Negocio - TapStyle

## Visión General
El **admin-negocio** es el panel de control de un cliente que ha contratado el sistema TapStyle. Cada cliente gestiona exclusivamente su propia empresa, datos y operaciones. Es un entorno **multi-tenant** donde cada usuario admin solo ve y opera sobre su empresa.

---

## Estructura del Sistema

```
TAPSTYLE (Sistema Multi-Tenant)
    ├── Super Admin (Rol: superadmin)
    │   ├── Dashboard Global
    │   ├── Gestión de Empresas
    │   ├── Gestión de Módulos por Empresa
    │   └── Comisiones y Pagos
    │
    └── Admin del Negocio (Rol: admin_negocio) ← **NUESTRO ENFOQUE**
        └── [Para cada empresa contratada]
            ├── Dashboard de Empresa
            ├── Gestión de Inventario
            ├── Compras a Proveedores
            ├── Ventas a Clientes
            ├── Finanzas y Caja
            ├── Gestión de Empleados
            └── Reportes Empresariales
```

---

## Principios Clave para Admin-Negocio

### 1. **Contexto de Usuario Persistente**
Cada usuario admin-negocio tiene:
- `idUsuario`: Su ID en el sistema
- `idEmpresa`: Única empresa a la que tiene acceso
- `empresaNombre`: Nombre de la empresa
- `rol`: siempre "admin_negocio"
- `permisos`: Basados en su rol

**Storage**: `localStorage` después del login
```javascript
{
  tapstyle_user: { idUsuario, nombre, email, ... },
  idEmpresa: 122,
  empresaNombre: "Santis",
  empresaInitials: "SA",
  tapstyle_role: "admin_negocio",
  tapstyle_token: "..."
}
```

### 2. **Sidebar Dinámico y Consistente**
- El mismo sidebar en TODAS las páginas
- Muestra el nombre del usuario logueado
- Muestra el nombre de la empresa
- Activa automáticamente la página actual
- Colores corporativos: gris (fondo), rojo (acciones)

### 3. **Contexto Automático en Formularios**
Cada formulario debe llenar automáticamente:
- `idEmpresa` (del localStorage)
- `idUsuario` (del localStorage)
- Cualquier otro ID de contexto necesario

El usuario NO debe seleccionar su empresa, porque ya está definida.

### 4. **Validación de Permisos**
Antes de cargar cualquier página:
- Verificar que el usuario está logueado
- Verificar que tiene rol `admin_negocio`
- Verificar que tiene empresa asignada
- Si algo falla → redirigir a login

### 5. **APIs Filtradas por Empresa**
Todas las consultas a API deben incluir `idEmpresa`:
- GET `/api/productos?idEmpresa=122` → solo productos de empresa 122
- GET `/api/pedidos-compra?idEmpresa=122` → solo compras de empresa 122
- GET `/api/pedidos?idEmpresa=122` → solo ventas de empresa 122

---

## Módulos por Sección

### 📦 **CATÁLOGO** (Administrar productos)
- `productos.html` - CRUD de productos (crear, editar, eliminar, listar)
- `categorias.html` - Categorías de productos
- `marcas.html` - Marcas de productos

### 📋 **OPERACIONES** (Compras, ventas, inventario)
- `compras.html` - Órdenes de compra a proveedores
- `ventas.html` - Órdenes de venta a clientes
- `stock.html` - Gestión de inventario
- `proveedores.html` - Registro de proveedores
- `metodos_pago.html` - Métodos de pago disponibles

### 💰 **FINANZAS** (Dinero y reportes)
- `caja.html` - Movimientos de caja (entrada/salida de dinero)
- `finanzas_pagos.html` - Cuentas por cobrar, cuentas por pagar, análisis financiero

### 👥 **ADMINISTRACIÓN** (Usuarios, clientes, permisos)
- `clientes.html` - Clientes que han comprado (solo lectura, datos informativos)
- `empleados.html` - Empleados de la empresa (crear, editar, cambiar rol)
- `roles_permisos.html` - Definir permisos por rol
**Archivo**: `dashboard_admin_negocio.html`

**KPIs a mostrar**:
- Ventas del mes
- Compras pendientes
- Inventario bajo stock
- Caja disponible
- Clientes activos
- Proveedores principales

**Gráficos**:
- Ventas vs Compras (línea)
- Productos más vendidos (barras)
- Movimiento de caja (área)
- Tendencia de inventario

---

### 🛒 Gestión de Productos
**Archivo**: `pages/productos.html`

**Funcionalidades**:
- Listar productos de la empresa
- Crear nuevo producto (automático: idEmpresa)
- Editar producto
- Eliminar producto
- Ver detalles (categoría, marca, precio, stock)
- Filtros: por categoría, por marca, por rango de precio

**Campos**:
- Nombre del producto
- Descripción
- Categoría (dropdown del sistema)
- Marca (dropdown del sistema)
- Unidad de medida
- Precio costo
- Precio venta
- Stock actual
- Stock mínimo

---

### 📦 Compras a Proveedores
**Archivo**: `pages/compras.html`

**Funcionalidades**:
- Listar órdenes de compra
- Crear nueva compra
- Ver detalles de compra
- Cambiar estado (Pendiente → En Tránsito → Recibido)
- Registrar recepción de compra
- Generar comprobante

**Campos del formulario**:
- Proveedor (dropdown)
- Productos (selección múltiple con cantidad)
- Fecha de entrega esperada
- Notas

**Automático** (no el usuario):
- idEmpresa (del localStorage)
- idUsuario (del localStorage)
- Fecha de pedido (actual)
- Estado inicial: "Pendiente"

---

### 💳 Ventas a Clientes
**Archivo**: `pages/ventas.html`

**Funcionalidades**:
- Listar órdenes de venta/pedidos
- Crear nuevo pedido
- Ver detalles de pedido
- Cambiar estado (Pendiente → Preparando → Enviado → Entregado)
- Registrar cliente
- Aplicar descuentos
- Generar factura

**Campos**:
- Cliente (dropdown o crear nuevo)
- Productos (selección múltiple)
- Cantidad y precio unitario
- Descuento
- Método de pago
- Fecha de entrega

**Automático**:
- idEmpresa
- idUsuario (quien registra la venta)
- Fecha de pedido
- Estado inicial: "Pendiente"

---

### 📊 Inventario
**Archivo**: `pages/inventario.html`

**Funcionalidades**:
- Ver estado general del inventario
- Productos bajo stock (alerta roja)
- Movimientos recientes
- Ajustes de stock (entrada/salida manual)
- Historial de movimientos
- Reportes de rotación

**Visualización**:
- Tabla con: Producto, Stock Actual, Stock Mínimo, Movimiento (entrada/salida)
- Indicador visual si está bajo stock
- Botón para ajustar manualmente

---

### 💰 Finanzas y Caja
**Archivo**: `pages/caja.html`

**Funcionalidades**:
- Saldo actual de caja
- Movimientos diarios
- Registrar entrada de dinero (ventas, otros ingresos)
- Registrar salida de dinero (compras pagadas, gastos operativos)
- Conciliación de caja
- Reportes por período
- Análisis de flujo

**Detalles**:
- Tabla de movimientos con: tipo (entrada/salida), monto, concepto, usuario
- Balance del día
- Balance acumulado
- Comparativas mes anterior
- Métodos de pago (efectivo, transferencia, tarjeta)

---

### 🏦 Finanzas (Reportes y Análisis)
**Archivo**: `pages/finanzas_pagos.html`

**Funcionalidades**:
- **Resumen financiero general**: ingresos vs gastos
- **Cuentas por cobrar**: facturas pendientes de clientes
- **Cuentas por pagar**: deudas a proveedores pendientes
- **Récords de pagos**: historial de pagos realizados
- **Análisis de flujo**: proyecciones y tendencias
- **Reportes fiscales**: datos para contabilidad/impuestos

**Detalles**:
- Gráficos de ingresos/egresos por período
- Estado de cuentas por cobrar (cliente, monto, fecha vencimiento)
- Estado de cuentas por pagar (proveedor, monto, fecha vencimiento)
- Historial de transacciones completo
- Exportar reportes (PDF, Excel)

---

### 👥 Gestión de Clientes
**Archivo**: `pages/clientes.html`

**Funcionalidades**:
- Listar clientes de la empresa (solo los que han comprado)
- Ver detalles del cliente
- Ver historial de compras
- Ver deuda acumulada (cuentas por cobrar)
- Contacto y datos actualizados

**Campos visibles**:
- Nombre del cliente
- Email
- Teléfono
- Cantidad de compras
- Total gastado
- Última compra
- Deuda pendiente

**Nota**: Los clientes aparecen automáticamente cuando hacen su primera compra. El admin-negocio NO crea clientes manualmente.

---

### 👥 Gestión de Empleados
**Archivo**: `pages/empleados.html`

**Funcionalidades**:
- Listar empleados de la empresa
- Crear nuevo empleado
- Editar datos del empleado
- Cambiar rol (vendedor, almacenero, etc.)
- Ver historial de actividades
- Dar de baja empleado

**Campos**:
- Nombre completo
- Email
- Teléfono
- Rol (vendedor, almacenero, etc.)
- Estado (activo/inactivo)
- Fecha de inicio

---

### 🔐 Roles y Permisos
**Archivo**: `pages/roles_permisos.html`

**Funcionalidades**:
- Ver roles disponibles (vendedor, almacenero, contador, etc.)
- Ver permisos asignados a cada rol
- Editar permisos de roles (si el admin tiene permiso)
- Crear roles personalizados

**Roles predefinidos**:
- **Vendedor**: puede ver productos, crear ventas, ver caja
- **Almacenero**: puede gestionar inventario, recibir compras
- **Contador**: puede ver finanzas, reportes, cuentas por cobrar/pagar
- **Admin Negocio**: acceso total

---

### 📋 Categorías y Marcas
**Archivo**: `pages/categorias.html` y `pages/marcas.html`

**Funcionalidades**:
- Listar categorías/marcas de la empresa
- Crear nueva categoría/marca
- Editar nombre
- Eliminar (si no hay productos)

**Nota**: Estas pueden ser compartidas del sistema o propias de cada empresa (según tu modelo)

---

### 📈 Reportes
**Archivo**: `pages/reportes.html`

**Tipos de reportes**:
- Reporte de ventas (por período, por vendedor, por cliente)
- Reporte de compras (por proveedor, por estado)
- Reporte de inventario
- Reporte financiero
- Top 10 productos vendidos
- Clientes principales

---

## Estructura de Archivos

```
frontend/pages/admin/admin-negocio/
├── dashboard_admin_negocio.html       (Dashboard principal)
├── components/
│   └── sidebar.html                   (Sidebar reutilizable)
├── pages/
│   ├── productos.html                 (CRUD de productos - CATÁLOGO)
│   ├── categorias.html                (Categorías de productos - CATÁLOGO)
│   ├── marcas.html                    (Marcas de productos - CATÁLOGO)
│   ├── compras.html                   (Órdenes de compra - OPERACIONES)
│   ├── ventas.html                    (Órdenes de venta - OPERACIONES)
│   ├── stock.html                     (Gestión de inventario - OPERACIONES)
│   ├── proveedores.html               (Proveedores - OPERACIONES)
│   ├── metodos_pago.html              (Métodos de pago - OPERACIONES)
│   ├── caja.html                      (Caja y movimientos - FINANZAS)
│   ├── finanzas_pagos.html            (Reportes financieros - FINANZAS)
│   ├── clientes.html                  (Clientes - ADMINISTRACIÓN)
│   ├── empleados.html                 (Gestión de empleados - ADMINISTRACIÓN)
│   └── roles_permisos.html            (Roles y permisos - ADMINISTRACIÓN)
├── scripts/
│   ├── auth.js                        (Validar login + contexto)
│   ├── api.js                         (Funciones API reutilizables)
│   └── ui.js                          (Funciones UI comunes)
└── styles/
    └── admin-negocio.css              (Estilos corporativos)
```

---

## Flujo de Usuario

1. **Login** (`login.html`)
   - Usuario ingresa credenciales
   - Sistema verifica rol = "admin_negocio"
   - Guarda en localStorage: idEmpresa, empresaNombre, idUsuario
   - Redirige a `dashboard_admin_negocio.html`

2. **Dashboard** (`dashboard_admin_negocio.html`)
   - Valida que está logueado y tiene contexto
   - Carga KPIs de su empresa
   - Muestra sidebar con su nombre y empresa
   - Opciones para navegar a módulos

3. **Módulos** (cualquier página en `/pages/`)
   - Valida autenticación
   - Carga datos filtrados por `idEmpresa` del localStorage
   - Formularios llenan automáticamente idEmpresa e idUsuario
   - Todas las acciones respetan el contexto

4. **Logout**
   - Limpia localStorage
   - Redirige a login

---

## Consideraciones Técnicas

### Validación de Autenticación
```javascript
// En cada página
const usuario = JSON.parse(localStorage.getItem('tapstyle_user'));
const idEmpresa = localStorage.getItem('idEmpresa');
const rol = localStorage.getItem('tapstyle_role');

if (!usuario || !idEmpresa || rol !== 'admin_negocio') {
    window.location.href = '../../login.html';
}
```

### Filtrado de APIs
```javascript
// Siempre incluir idEmpresa en consultas
const response = await fetch(
    `http://localhost:8083/api/productos?idEmpresa=${idEmpresa}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
);
```

### Llenado Automático de Formularios
```javascript
// En cada formulario
const usuario = JSON.parse(localStorage.getItem('tapstyle_user'));
const idEmpresa = parseInt(localStorage.getItem('idEmpresa'));

const datos = {
    idEmpresa: idEmpresa,
    idUsuario: usuario.idUsuario,
    // ... resto de campos
};

await fetch(`http://localhost:8083/api/...`, {
    method: 'POST',
    body: JSON.stringify(datos)
});
```

---

## Checklist de Implementación

- [ ] **Fundamentos:**
  - [ ] `scripts/auth.js` - Validación de login y contexto
  - [ ] `scripts/api.js` - Funciones para llamadas al backend
  - [ ] `dashboard_admin_negocio.html` - Dashboard con KPIs

- [ ] **CATÁLOGO:**
  - [ ] `pages/productos.html` - CRUD de productos
  - [ ] `pages/categorias.html` - Categorías
  - [ ] `pages/marcas.html` - Marcas

- [ ] **OPERACIONES:**
  - [ ] `pages/compras.html` - Órdenes de compra
  - [ ] `pages/ventas.html` - Órdenes de venta
  - [ ] `pages/stock.html` - Inventario
  - [ ] `pages/proveedores.html` - Proveedores
  - [ ] `pages/metodos_pago.html` - Métodos de pago

- [ ] **FINANZAS:**
  - [ ] `pages/caja.html` - Movimientos de caja
  - [ ] `pages/finanzas_pagos.html` - Finanzas y reportes

- [ ] **ADMINISTRACIÓN:**
  - [ ] `pages/clientes.html` - Clientes
  - [ ] `pages/empleados.html` - Empleados
  - [ ] `pages/roles_permisos.html` - Roles y permisos

- [ ] Estilos CSS y responsividad

---

## Notas Importantes

1. **Contexto es Rey**: El usuario siempre sabe en qué empresa está. No hay ambigüedad.
2. **Seguridad**: Valida rol y empresa en CADA página. No confíes solo en localStorage.
3. **UX Clara**: El usuario ve su nombre, su empresa, su rol. Siempre.
4. **APIs Limpias**: Todas las consultas incluyen idEmpresa en la URL o body.
5. **Mantenibilidad**: Componentes reutilizables (sidebar, navbar, formularios).

