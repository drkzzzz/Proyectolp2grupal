-- 1. Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS TAPSTYLE;

USE TAPSTYLE;

-- GESTIÓN DE EMPRESAS/TIENDAS (Multi-Tenencia)
CREATE TABLE Empresas (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tienda VARCHAR(100) NOT NULL UNIQUE, 
    ruc_empresa VARCHAR(20) UNIQUE, 
    direccion_legal VARCHAR(255),
    telefono VARCHAR(20),
    email_contacto VARCHAR(100),
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_aprobacion VARCHAR(20) NOT NULL DEFAULT 'Pendiente', 
    tasa_comision DECIMAL(5, 2) NOT NULL DEFAULT 0.15, 
    CONSTRAINT CHK_EstadoAprobacion CHECK (estado_aprobacion IN ('Pendiente', 'Aprobada', 'Suspendida'))
);

-- MÓDULO 1: GESTIÓN DE USUARIOS, ROLES Y PERMISOS (RBAC)
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE, 
    estado BOOLEAN NOT NULL DEFAULT TRUE, -- BIT a BOOLEAN
    descripcion VARCHAR(255)
);

CREATE TABLE Permisos (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre_permiso VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE Rol_Permisos (
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    CONSTRAINT FK_RolPermisos_Roles FOREIGN KEY (id_rol) REFERENCES Roles(id_rol) ON DELETE CASCADE,
    CONSTRAINT FK_RolPermisos_Permisos FOREIGN KEY (id_permiso) REFERENCES Permisos(id_permiso) ON DELETE CASCADE
);

CREATE TABLE TipoDocumento (
    id_tipodocumento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipodocumento VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de Usuarios (Para Login y Roles)
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT, 
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    id_tipodocumento INT,
    numero_documento VARCHAR(20),
    celular VARCHAR(20),
    direccion VARCHAR(255),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contraseña_hash VARCHAR(255) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE, -- BIT a BOOLEAN
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_sesion DATETIME,
    
    CONSTRAINT FK_Usuarios_TipoDocumento FOREIGN KEY (id_tipodocumento) REFERENCES TipoDocumento(id_tipodocumento),
    CONSTRAINT UQ_Usuarios_Documento UNIQUE (id_tipodocumento, numero_documento),
    CONSTRAINT FK_Usuarios_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa)
);

CREATE TABLE Usuario_Roles (
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT FK_UsuarioRoles_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_UsuarioRoles_Roles FOREIGN KEY (id_rol) REFERENCES Roles(id_rol) ON DELETE CASCADE
);

CREATE TABLE Bitacora (
    id_bitacora BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accion VARCHAR(100) NOT NULL,
    detalle_accion TEXT, -- NVARCHAR(600) a TEXT
    ip_origen VARCHAR(45),
    CONSTRAINT FK_Bitacora_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- MÓDULO 2: GESTIÓN DE CLIENTES Y PROVEEDORES
-- Tabla de Clientes (Datos del Comprador, vinculado al Usuario para mantener la relación)
CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE, 
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    id_tipodocumento INT,
    numero_documento VARCHAR(20),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100), 
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE, -- BIT a BOOLEAN
    
    CONSTRAINT FK_Clientes_TipoDocumento FOREIGN KEY (id_tipodocumento) REFERENCES TipoDocumento(id_tipodocumento),
    CONSTRAINT UQ_Clientes_Documento UNIQUE (id_tipodocumento, numero_documento),
    CONSTRAINT FK_Clientes_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Tabla de Proveedores (Vinculado a la Empresa/Tienda)
CREATE TABLE Proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(100),
    ruc VARCHAR(20),
    rubro VARCHAR(100),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100),
    
    CONSTRAINT UQ_Proveedor_Empresa_RUC UNIQUE (id_empresa, ruc),
    CONSTRAINT FK_Proveedores_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa)
);

-- MÓDULO 3: GESTIÓN DE PRODUCTOS E INVENTARIO
-- CategoríasProducto (Global)
CREATE TABLE CategoriasProducto (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

-- MarcasProducto (Vinculado a la Empresa)
CREATE TABLE MarcasProducto (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nombre_marca VARCHAR(50) NOT NULL,
    
    CONSTRAINT UQ_Marca_Empresa UNIQUE (id_empresa, nombre_marca),
    CONSTRAINT FK_Marcas_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa)
);

CREATE TABLE Modelos (
    id_modelo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_modelo VARCHAR(100) NOT NULL,
    id_marca INT NOT NULL,
    imagen_principal VARCHAR(255),
    CONSTRAINT FK_Modelos_Marcas FOREIGN KEY (id_marca) REFERENCES MarcasProducto(id_marca)
);

CREATE TABLE MaterialesProducto (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nombre_material VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE UnidadesMedida (
    id_unidad_medida INT AUTO_INCREMENT PRIMARY KEY,
    nombre_unidad VARCHAR(50) NOT NULL UNIQUE,
    abreviatura VARCHAR(10)
);

-- Productos (Maestro, Vinculado a la Empresa)
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL, 
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT, -- NVARCHAR(600) a TEXT
    id_categoria INT NOT NULL,
    id_proveedor INT,
    id_unidad_medida INT NOT NULL,
    dimensiones VARCHAR(50),
    peso_gramos INT,
    id_marca INT,
    id_modelo INT,
    id_material INT,
    
    CONSTRAINT UQ_Producto_Empresa_Nombre UNIQUE (id_empresa, nombre_producto),
    CONSTRAINT FK_Productos_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa),
    CONSTRAINT FK_Productos_Categorias FOREIGN KEY (id_categoria) REFERENCES CategoriasProducto(id_categoria),
    CONSTRAINT FK_Productos_Proveedores FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor),
    CONSTRAINT FK_Productos_Marcas FOREIGN KEY (id_marca) REFERENCES MarcasProducto(id_marca),
    CONSTRAINT FK_Productos_Modelos FOREIGN KEY (id_modelo) REFERENCES Modelos(id_modelo),
    CONSTRAINT FK_Productos_Materiales FOREIGN KEY (id_material) REFERENCES MaterialesProducto(id_material),
    CONSTRAINT FK_Productos_UnidadesMedida FOREIGN KEY (id_unidad_medida) REFERENCES UnidadesMedida(id_unidad_medida)
);

-- VariantesProducto (Talla, Color, Precio y SKU)
CREATE TABLE VariantesProducto (
    id_variante INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    codigo_sku VARCHAR(50) UNIQUE,
    talla VARCHAR(10) NOT NULL,
    color VARCHAR(50) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    costo_compra DECIMAL(10, 2),
    
    CONSTRAINT UQ_Variante_Producto_Talla_Color UNIQUE (id_producto, talla, color),
    CONSTRAINT FK_Variantes_Productos FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE TiposProducto (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Producto_Tipos (
    id_producto INT NOT NULL,
    id_tipo INT NOT NULL,
    PRIMARY KEY (id_producto, id_tipo),
    CONSTRAINT FK_ProductoTipos_Productos FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE,
    CONSTRAINT FK_ProductoTipos_Tipos FOREIGN KEY (id_tipo) REFERENCES TiposProducto(id_tipo) ON DELETE CASCADE
);

-- Almacenes (Vinculado a la Empresa)
CREATE TABLE Almacenes (
    id_almacen INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nombre_almacen VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255),
    
    CONSTRAINT UQ_Almacen_Empresa_Nombre UNIQUE (id_empresa, nombre_almacen),
    CONSTRAINT FK_Almacenes_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa)
);

-- Inventario (Stock por Variante y Almacén)
CREATE TABLE Inventario (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_variante INT NOT NULL, 
    id_almacen INT NOT NULL,
    cantidad_stock INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 5,
    -- Se añade ON UPDATE CURRENT_TIMESTAMP para que la fecha se actualice con cada cambio de stock
    fecha_ultima_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    
    CONSTRAINT UQ_Inventario_Variante_Almacen UNIQUE (id_variante, id_almacen),
    CONSTRAINT FK_Inventario_Variantes FOREIGN KEY (id_variante) REFERENCES VariantesProducto(id_variante) ON DELETE CASCADE,
    CONSTRAINT FK_Inventario_Almacenes FOREIGN KEY (id_almacen) REFERENCES Almacenes(id_almacen) ON DELETE CASCADE
);

-- MÓDULO 4: GESTIÓN DE MOVIMIENTOS Y TRANSACCIONES
CREATE TABLE TiposMovimientoInventario (
    id_tipo_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE,
    es_entrada BOOLEAN NOT NULL -- BIT a BOOLEAN
);

-- MovimientosInventario (Enlazado a la Variante)
CREATE TABLE MovimientosInventario (
    id_movimiento_inv BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_variante INT NOT NULL,
    id_almacen INT,
    id_tipo_movimiento INT NOT NULL,
    cantidad INT NOT NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    observaciones TEXT, -- NVARCHAR(MAX) a TEXT
    referencia_doc VARCHAR(50),
    
    CONSTRAINT FK_MovInv_Variantes FOREIGN KEY (id_variante) REFERENCES VariantesProducto(id_variante),
    CONSTRAINT FK_MovInv_Almacenes FOREIGN KEY (id_almacen) REFERENCES Almacenes(id_almacen),
    CONSTRAINT FK_MovInv_TiposMovimiento FOREIGN KEY (id_tipo_movimiento) REFERENCES TiposMovimientoInventario(id_tipo_movimiento),
    CONSTRAINT FK_MovInv_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE TiposComprobantePago (
    id_tipo_comprobante INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE,
    serie_documento VARCHAR(10)
);

CREATE TABLE TiposPago (
    id_tipopago INT AUTO_INCREMENT PRIMARY KEY,
    tipo_pago VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Proveedor_MetodosPago (
    id_proveedor INT NOT NULL,
    id_tipopago INT NOT NULL,
    datos_pago VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_proveedor, id_tipopago),
    CONSTRAINT FK_ProvMetodos_Proveedor FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor) ON DELETE CASCADE,
    CONSTRAINT FK_ProvMetodos_TipoPago FOREIGN KEY (id_tipopago) REFERENCES TiposPago(id_tipopago) ON DELETE CASCADE
);

-- ComprobantesPago (Vinculado a la Empresa dueña de la venta)
CREATE TABLE ComprobantesPago (
    id_comprobante BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL, 
    id_cliente INT, 
    id_usuario INT NOT NULL, 
    id_tipo_comprobante INT NOT NULL,
    numero_comprobante VARCHAR(20) NOT NULL,
    fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    igv DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Emitido',
    motivo_anulacion TEXT, -- NVARCHAR(2000) a TEXT
    
    CONSTRAINT UQ_Comprobante_Tipo_Numero UNIQUE (id_tipo_comprobante, numero_comprobante),
    CONSTRAINT FK_Comprobantes_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa),
    CONSTRAINT FK_Comprobantes_Clientes FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    CONSTRAINT FK_Comprobantes_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    CONSTRAINT FK_Comprobantes_TiposComprobante FOREIGN KEY (id_tipo_comprobante) REFERENCES TiposComprobantePago(id_tipo_comprobante)
);

CREATE TABLE PagosComprobante (
    id_pago BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_comprobante BIGINT NOT NULL,
    id_tipopago INT NOT NULL,
    monto_pagado DECIMAL(10, 2) NOT NULL,
    referencia_pago VARCHAR(100),
    CONSTRAINT FK_Pagos_Comprobantes FOREIGN KEY (id_comprobante) REFERENCES ComprobantesPago(id_comprobante) ON DELETE CASCADE,
    CONSTRAINT FK_Pagos_TiposPago FOREIGN KEY (id_tipopago) REFERENCES TiposPago(id_tipopago)
);

-- DetallesComprobantePago (Enlazado a la Variante)
CREATE TABLE DetallesComprobantePago (
    id_detalle_comprobante BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_comprobante BIGINT NOT NULL,
    id_variante INT NOT NULL, 
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    descuento_aplicado DECIMAL(10, 2) NOT NULL DEFAULT 0,
    subtotal_linea DECIMAL(10, 2) NOT NULL,
    
    CONSTRAINT FK_DetallesComprobante_Comprobantes FOREIGN KEY (id_comprobante) REFERENCES ComprobantesPago(id_comprobante) ON DELETE CASCADE,
    CONSTRAINT FK_DetallesComprobante_Variantes FOREIGN KEY (id_variante) REFERENCES VariantesProducto(id_variante)
);

-- MÓDULO 5: GESTIÓN DE CAJA
-- Cajas (Vinculado a la Empresa)
CREATE TABLE Cajas (
    id_caja INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nombre_caja VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'Cerrada',
    
    CONSTRAINT UQ_Caja_Empresa_Nombre UNIQUE (id_empresa, nombre_caja),
    CONSTRAINT FK_Cajas_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa)
);

CREATE TABLE AperturasCaja (
    id_apertura BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_apertura DATE NOT NULL,
    hora_apertura TIME NOT NULL,
    monto_inicial DECIMAL(10, 2) NOT NULL,
    CONSTRAINT UQ_AperturaCaja_Caja_Fecha UNIQUE (id_caja, fecha_apertura),
    CONSTRAINT FK_AperturasCaja_Cajas FOREIGN KEY (id_caja) REFERENCES Cajas(id_caja),
    CONSTRAINT FK_AperturasCaja_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE CierresCaja (
    id_cierre BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_apertura BIGINT NOT NULL UNIQUE,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_cierre DATE NOT NULL,
    hora_cierre TIME NOT NULL,
    monto_final DECIMAL(10, 2) NOT NULL,
    monto_esperado DECIMAL(10, 2) NOT NULL,
    diferencia DECIMAL(10, 2) NOT NULL,
    observaciones TEXT, -- NVARCHAR(MAX) a TEXT
    CONSTRAINT FK_CierresCaja_Aperturas FOREIGN KEY (id_apertura) REFERENCES AperturasCaja(id_apertura),
    CONSTRAINT FK_CierresCaja_Cajas FOREIGN KEY (id_caja) REFERENCES Cajas(id_caja),
    CONSTRAINT FK_CierresCaja_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE MovimientosCaja (
    id_movimiento_caja BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_movimiento VARCHAR(10) NOT NULL, 
    monto DECIMAL(10, 2) NOT NULL,
    descripcion TEXT, -- NVARCHAR(MAX) a TEXT
    id_comprobante BIGINT,
    CONSTRAINT FK_MovimientosCaja_Cajas FOREIGN KEY (id_caja) REFERENCES Cajas(id_caja),
    CONSTRAINT FK_MovimientosCaja_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    CONSTRAINT FK_MovimientosCaja_Comprobantes FOREIGN KEY (id_comprobante) REFERENCES ComprobantesPago(id_comprobante)
);
-- MÓDULO 6: GESTIÓN DE PEDIDOS A PROVEEDORES
CREATE TABLE PedidosCompra (
    id_pedido_compra BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega_esperada DATE,
    estado_pedido VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    total_pedido DECIMAL(10, 2) NOT NULL DEFAULT 0,
    CONSTRAINT FK_PedidosCompra_Proveedores FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor),
    CONSTRAINT FK_PedidosCompra_Usuarios FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);
-- DetallesPedidoCompra (Enlazado a la Variante)
CREATE TABLE DetallesPedidoCompra (
    id_detalle_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido_compra BIGINT NOT NULL,
    id_variante INT NOT NULL, 
    cantidad_pedida INT NOT NULL,
    costo_unitario DECIMAL(10, 2) NOT NULL,
    subtotal_linea DECIMAL(10, 2) NOT NULL,
    cantidad_recibida INT NOT NULL DEFAULT 0,
    CONSTRAINT UQ_DetallePedido_Pedido_Variante UNIQUE (id_pedido_compra, id_variante),
    CONSTRAINT FK_DetallesPedidoCompra_Pedidos FOREIGN KEY (id_pedido_compra) REFERENCES PedidosCompra(id_pedido_compra) ON DELETE CASCADE,
    CONSTRAINT FK_DetallesPedidoCompra_Variantes FOREIGN KEY (id_variante) REFERENCES VariantesProducto(id_variante)
);

-- MÓDULO 7: FINANZAS TAPSTYLE - MODELO HÍBRIDO (SUSCRIPCIÓN + COMISIÓN)

-- Planes de Suscripción disponibles
CREATE TABLE PlanesSuscripcion (
    id_plan INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plan VARCHAR(50) NOT NULL UNIQUE, -- 'Básico', 'Premium', 'Enterprise'
    precio_mensual DECIMAL(10, 2) NOT NULL,
    max_productos INT, -- Límite de productos por plan (NULL = ilimitado)
    max_empleados INT, -- Límite de empleados por plan
    comision_adicional DECIMAL(5, 2) NOT NULL DEFAULT 0, -- % comisión por ventas
    descripcion TEXT,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

-- Suscripciones activas de las empresas
CREATE TABLE SuscripcionesEmpresa (
    id_suscripcion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_plan INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    precio_acordado DECIMAL(10, 2) NOT NULL, -- Por si hay descuentos especiales
    estado VARCHAR(20) NOT NULL DEFAULT 'Activa', -- 'Activa', 'Vencida', 'Suspendida'
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT FK_Suscripciones_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa),
    CONSTRAINT FK_Suscripciones_Planes FOREIGN KEY (id_plan) REFERENCES PlanesSuscripcion(id_plan),
    CONSTRAINT CHK_EstadoSuscripcion CHECK (estado IN ('Activa', 'Vencida', 'Suspendida'))
);

-- Facturas que TapStyle emite a las empresas (SUSCRIPCIÓN)
CREATE TABLE FacturasSuscripcion (
    id_factura_suscripcion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_suscripcion BIGINT NOT NULL,
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    monto_suscripcion DECIMAL(10, 2) NOT NULL,
    fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'Pagado', 'Vencido'
    fecha_pago DATETIME,
    metodo_pago VARCHAR(50),
    
    CONSTRAINT FK_FacturasSusc_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa),
    CONSTRAINT FK_FacturasSusc_Suscripciones FOREIGN KEY (id_suscripcion) REFERENCES SuscripcionesEmpresa(id_suscripcion),
    CONSTRAINT CHK_EstadoFacturaSusc CHECK (estado IN ('Pendiente', 'Pagado', 'Vencido'))
);

-- Facturas de comisión por ventas (COMISIÓN)
CREATE TABLE FacturasComision (
    id_factura_comision BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    total_ventas_periodo DECIMAL(10, 2) NOT NULL,
    porcentaje_comision DECIMAL(5, 2) NOT NULL,
    monto_comision DECIMAL(10, 2) NOT NULL,
    fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'Pagado', 'Vencido'
    fecha_pago DATETIME,
    metodo_pago VARCHAR(50),
    
    CONSTRAINT FK_FacturasComision_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa),
    CONSTRAINT CHK_EstadoFacturaComision CHECK (estado IN ('Pendiente', 'Pagado', 'Vencido'))
);

-- Pagos realizados por las empresas a TapStyle
CREATE TABLE PagosEmpresaATapStyle (
    id_pago BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    tipo_pago VARCHAR(20) NOT NULL, -- 'Suscripcion', 'Comision'
    id_factura_suscripcion BIGINT,
    id_factura_comision BIGINT,
    monto_pagado DECIMAL(10, 2) NOT NULL,
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(50) NOT NULL, -- 'Transferencia', 'Tarjeta', 'Efectivo'
    referencia_pago VARCHAR(100),
    comprobante_pago VARCHAR(255), -- Ruta del archivo del comprobante
    
    CONSTRAINT FK_PagosEmpresa_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa),
    CONSTRAINT FK_PagosEmpresa_FactSusc FOREIGN KEY (id_factura_suscripcion) REFERENCES FacturasSuscripcion(id_factura_suscripcion),
    CONSTRAINT FK_PagosEmpresa_FactComision FOREIGN KEY (id_factura_comision) REFERENCES FacturasComision(id_factura_comision),
    CONSTRAINT CHK_TipoPago CHECK (tipo_pago IN ('Suscripcion', 'Comision')),
    CONSTRAINT CHK_FacturaValida CHECK (
        (tipo_pago = 'Suscripcion' AND id_factura_suscripcion IS NOT NULL AND id_factura_comision IS NULL) OR
        (tipo_pago = 'Comision' AND id_factura_comision IS NOT NULL AND id_factura_suscripcion IS NULL)
    )
);

-- MÓDULOS DEL SISTEMA TAPSTYLE
CREATE TABLE ModulosSistema (
    id_modulo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_modulo VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    icono VARCHAR(50), -- Para la interfaz
    orden_menu INT, -- Orden en el menú
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

-- MÓDULOS INCLUIDOS EN CADA PLAN
CREATE TABLE PlanModulos (
    id_plan INT NOT NULL,
    id_modulo INT NOT NULL,
    incluido BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id_plan, id_modulo),
    CONSTRAINT FK_PlanModulos_Planes FOREIGN KEY (id_plan) REFERENCES PlanesSuscripcion(id_plan) ON DELETE CASCADE,
    CONSTRAINT FK_PlanModulos_Modulos FOREIGN KEY (id_modulo) REFERENCES ModulosSistema(id_modulo) ON DELETE CASCADE
);

-- MÓDULOS ACTIVOS POR EMPRESA (Personalización del Super Admin)
CREATE TABLE EmpresaModulos (
    id_empresa INT NOT NULL,
    id_modulo INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_activacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_desactivacion DATETIME,
    PRIMARY KEY (id_empresa, id_modulo),
    CONSTRAINT FK_EmpresaModulos_Empresas FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE,
    CONSTRAINT FK_EmpresaModulos_Modulos FOREIGN KEY (id_modulo) REFERENCES ModulosSistema(id_modulo) ON DELETE CASCADE
);

-- DATOS INICIALES PARA MÓDULOS DEL SISTEMA
INSERT INTO ModulosSistema (nombre_modulo, descripcion, icono, orden_menu) VALUES
('productos_catalogo', 'Gestión de Productos y Catálogo', 'package', 1),
('ventas_pedidos', 'Ventas y Gestión de Pedidos', 'shopping-cart', 2),
('inventario_almacenes', 'Control de Inventario y Almacenes', 'warehouse', 3),
('finanzas_pagos', 'Finanzas y Gestión de Pagos', 'credit-card', 4),
('gestion_empleados', 'Gestión de Empleados', 'users', 5),
('roles_permisos', 'Roles y Permisos', 'shield', 6),
('reportes_analytics', 'Reportes y Analytics', 'bar-chart', 7),
('configuracion', 'Configuración de la Tienda', 'settings', 8);

-- DATOS INICIALES PARA PLANES DE SUSCRIPCIÓN
INSERT INTO PlanesSuscripcion (nombre_plan, precio_mensual, max_productos, max_empleados, comision_adicional, descripcion) VALUES
('Básico', 199.00, 100, 3, 2.0, 'Plan ideal para pequeñas tiendas. Incluye módulos básicos.'),
('Premium', 399.00, 500, 10, 1.5, 'Plan para tiendas en crecimiento. Incluye módulos avanzados.'),
('Enterprise', 799.00, NULL, NULL, 1.0, 'Plan completo para grandes empresas. Todos los módulos incluidos.');

-- ASIGNACIÓN DE MÓDULOS POR PLAN
-- Plan Básico: Solo productos, ventas e inventario
INSERT INTO PlanModulos (id_plan, id_modulo, incluido) VALUES
(1, 1, TRUE),  -- Productos y Catálogo
(1, 2, TRUE),  -- Ventas y Pedidos
(1, 3, TRUE),  -- Inventario y Almacenes
(1, 8, TRUE),  -- Configuración
(1, 4, FALSE), -- Finanzas (NO incluido)
(1, 5, FALSE), -- Empleados (NO incluido)
(1, 6, FALSE), -- Roles (NO incluido)
(1, 7, FALSE); -- Reportes (NO incluido)

-- Plan Premium: Básico + finanzas + empleados + roles
INSERT INTO PlanModulos (id_plan, id_modulo, incluido) VALUES
(2, 1, TRUE),  -- Productos y Catálogo
(2, 2, TRUE),  -- Ventas y Pedidos
(2, 3, TRUE),  -- Inventario y Almacenes
(2, 4, TRUE),  -- Finanzas y Pagos
(2, 5, TRUE),  -- Gestión de Empleados
(2, 6, TRUE),  -- Roles y Permisos
(2, 8, TRUE),  -- Configuración
(2, 7, FALSE); -- Reportes (NO incluido)

-- Plan Enterprise: Todos los módulos
INSERT INTO PlanModulos (id_plan, id_modulo, incluido) VALUES
(3, 1, TRUE),  -- Productos y Catálogo
(3, 2, TRUE),  -- Ventas y Pedidos
(3, 3, TRUE),  -- Inventario y Almacenes
(3, 4, TRUE),  -- Finanzas y Pagos
(3, 5, TRUE),  -- Gestión de Empleados
(3, 6, TRUE),  -- Roles y Permisos
(3, 7, TRUE),  -- Reportes y Analytics
(3, 8, TRUE);  -- Configuración