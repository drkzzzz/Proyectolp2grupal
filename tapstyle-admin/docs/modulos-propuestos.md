# Propuesta de Módulos del Sidebar (Admin de Tienda)

## 1. Introducción

Este documento define la estructura de navegación principal (sidebar) para el panel de administración de la tienda. El objetivo es proporcionar al **dueño de la tienda** un acceso lógico y agrupado a todas las funcionalidades necesarias para gestionar su storefront online, desde el catálogo de productos hasta el análisis de ventas.

Los módulos se agrupan por áreas de negocio para facilitar el flujo de trabajo.

---

## 2. 🏠 Grupo: Principal

Este grupo contiene el punto de entrada principal al sistema.

### **Dashboard (Tablero)**

- **Descripción:** Vista principal y resumen de la actividad de la tienda. Muestra KPIs clave como ventas del día, pedidos pendientes, productos con bajo stock y últimos clientes registrados.
- **Tablas de Referencia:** (Lectura de) `ComprobantesPago`, `Inventario`, `Clientes`, `Productos`.

---

## 3. 🛍️ Grupo: Catálogo y Storefront

Todo lo relacionado con los productos que se muestran y venden al público.

### **Productos y Catálogo**

- **Descripción:** Módulo central para crear, editar y eliminar productos. Permite gestionar el producto maestro (nombre, descripción) y sus variantes (talla, color, SKU, precio).
- **Tablas de Referencia:** `Productos`, `VariantesProducto`, `Producto_Tipos`.
- **Tablas de Apoyo (Lectura):** `CategoriasProducto`, `MaterialesProducto`.

### **Marcas y Modelos**

- **Descripción:** Administra las marcas y modelos propios que la tienda maneja. Esto permite agrupar productos y facilitar filtros en el storefront.
- **Tablas de Referencia:** `MarcasProducto`, `Modelos`.

### **Proveedores**

- **Descripción:** Módulo para administrar la base de datos de proveedores de la tienda (quienes te venden la ropa y accesorios a ti).
- **Tablas de Referencia:** `Proveedores`, `Proveedor_MetodosPago`.

---

## 4. 📦 Grupo: Operaciones y Logística

Gestión del día a día: ventas, clientes y movimiento de stock.

### **Ventas y Pedidos**

- **Descripción:** Módulo para visualizar y gestionar los pedidos realizados por los clientes en el storefront. Permite ver detalles, confirmar pagos y cambiar estados (ej. "Pendiente", "En preparación", "Enviado").
- **Tablas de Referencia:** `ComprobantesPago`, `DetallesComprobantePago`, `PagosComprobante`.

### **Clientes**

- **Descripción:** Base de datos de los clientes que se han registrado o han comprado en la tienda. Permite ver su historial de compras y datos de contacto.
- **Tablas de Referencia:** `Clientes`.

### **Inventario y Almacenes**

- **Descripción:** Permite gestionar los almacenes físicos o virtuales de la tienda. Es el módulo clave para consultar el stock real de cada variante de producto (`VariantesProducto`).
- **Tablas de Referencia:** `Almacenes`, `Inventario`.

### **Movimientos de Stock**

- **Descripción:** Un registro (bitácora) de todos los cambios en el inventario. Muestra entradas (ej. recepción de pedido a proveedor) y salidas (ej. venta confirmada).
- **Tablas de Referencia:** `MovimientosInventario`, `TiposMovimientoInventario`.

### **Pedidos de Compra (a Proveedor)**

- **Descripción:** Módulo para crear y dar seguimiento a las órdenes de compra que la tienda realiza a sus `Proveedores` para reabastecer el inventario.
- **Tablas de Referencia:** `PedidosCompra`, `DetallesPedidoCompra`.

---

## 5. 📈 Grupo: Finanzas y Analítica

Módulos para el control financiero interno y la toma de decisiones.

### **Finanzas y Pagos (Caja)**

- **Descripción:** Para una tienda 100% online, esto funciona como una "caja virtual". Permite registrar flujos de dinero (ej. retiro de ganancias) y conciliar los pagos recibidos de las pasarelas de pago.
- **Tablas de Referencia:** `Cajas`, `AperturasCaja`, `CierresCaja`, `MovimientosCaja`.

### **Reportes y Analítica**

- **Descripción:** Módulo virtual (sin tablas propias de CRUD) que genera reportes clave para el negocio, como "Productos más vendidos", "Ventas por período", "Stock valorizado", etc.
- **Tablas de Referencia:** (Lectura de) `ComprobantesPago`, `DetallesComprobantePago`, `Inventario`, `Clientes`.

---

## 6. ⚙️ Grupo: Administración de Tienda

Configuración interna del personal y del perfil de la tienda.

### **Gestión de Empleados**

- **Descripción:** Permite al dueño de la tienda crear, editar o desactivar las cuentas de sus empleados (ej. "Asistente de Pedidos", "Contador") que tendrán acceso a este panel administrativo.
- **Tablas de Referencia:** `Usuarios` (filtrados por `id_empresa`), `Usuario_Roles`.

### **Roles y Permisos**

- **Descripción:** Módulo para crear roles personalizados (ej. "Rol de Bodega") y asignarles permisos específicos (ej. "Solo puede ver Inventario y Pedidos de Compra").
- **Tablas de Referencia:** `Roles`, `Permisos`, `Rol_Permisos`.

### **Configuración de Tienda**

- **Descripción:** Permite al dueño editar la información pública de su tienda (nombre, RUC, dirección, email de contacto) que se muestra en el storefront o en los comprobantes.
- **Tablas de Referencia:** `Empresas` (solo la fila de la tienda actual).
