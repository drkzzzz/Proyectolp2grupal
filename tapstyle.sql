-- phpMyAdmin SQL Dump
-- Versión 5.2.1
-- Servidor: 127.0.0.1
-- Base de datos: `tapstyle`
-- Tiempo de generación: 06-12-2025

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Nota de Corrección: Se eliminaron las tablas duplicadas (ej. `categorias_producto`, `marcas_producto`, etc.) 
-- y se reasignaron todas las referencias (`FOREIGN KEY`) a las tablas principales.
--

--
-- Eliminación de tablas duplicadas o redundantes para evitar conflictos
--
DROP TABLE IF EXISTS `variantes_producto`;
DROP TABLE IF EXISTS `unidades_medida`;
DROP TABLE IF EXISTS `tipo_documento`;
DROP TABLE IF EXISTS `materiales_producto`;
DROP TABLE IF EXISTS `marcas_producto`;
DROP TABLE IF EXISTS `categorias_producto`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacenes`
--
CREATE TABLE `almacenes` (
  `id_almacen` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `nombre_almacen` varchar(100) NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `almacenes`
--
INSERT INTO `almacenes` (`id_almacen`, `id_empresa`, `nombre_almacen`, `ubicacion`) VALUES
(1, 1, 'Almacén Central GE', 'Jr. Warehouse #100'),
(2, 1, 'Almacén Secundario GE', 'Av. Segunda #200');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aperturascaja`
--
CREATE TABLE `aperturascaja` (
  `id_apertura` bigint(20) NOT NULL,
  `id_caja` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_apertura` date NOT NULL,
  `hora_apertura` time NOT NULL,
  `monto_inicial` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacora`
--
CREATE TABLE `bitacora` (
  `id_bitacora` bigint(20) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `accion` varchar(100) NOT NULL,
  `detalle_accion` text DEFAULT NULL,
  `ip_origen` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cajas`
--
CREATE TABLE `cajas` (
  `id_caja` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `nombre_caja` varchar(50) NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Cerrada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoriasproducto`
--
CREATE TABLE `categoriasproducto` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoriasproducto`
--
INSERT INTO `categoriasproducto` (`id_categoria`, `nombre_categoria`, `descripcion`) VALUES
(1, 'Camisetas', 'Camisetas varias'),
(2, 'Pantalones', 'Pantalones varias'),
(3, 'Zapatos', 'Zapatos varias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cierrescaja`
--
CREATE TABLE `cierrescaja` (
  `id_cierre` bigint(20) NOT NULL,
  `id_apertura` bigint(20) NOT NULL,
  `id_caja` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_cierre` date NOT NULL,
  `hora_cierre` time NOT NULL,
  `monto_final` decimal(10,2) NOT NULL,
  `monto_esperado` decimal(10,2) NOT NULL,
  `diferencia` decimal(10,2) NOT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--
CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `id_tipodocumento` int(11) DEFAULT NULL,
  `numero_documento` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantespago`
--
CREATE TABLE `comprobantespago` (
  `id_comprobante` bigint(20) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_tipo_comprobante` int(11) NOT NULL,
  `numero_comprobante` varchar(20) NOT NULL,
  `fecha_emision` datetime NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL,
  `igv` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Emitido',
  `motivo_anulacion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallescomprobantepago`
--
CREATE TABLE `detallescomprobantepago` (
  `id_detalle_comprobante` bigint(20) NOT NULL,
  `id_comprobante` bigint(20) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `descuento_aplicado` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subtotal_linea` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallespedidocompra`
--
CREATE TABLE `detallespedidocompra` (
  `id_detalle_pedido` bigint(20) NOT NULL,
  `id_pedido_compra` bigint(20) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `cantidad_pedida` int(11) NOT NULL,
  `costo_unitario` decimal(10,2) NOT NULL,
  `subtotal_linea` decimal(10,2) NOT NULL,
  `cantidad_recibida` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresamodulos`
--
CREATE TABLE `empresamodulos` (
  `id_empresa` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_activacion` datetime DEFAULT current_timestamp(),
  `fecha_desactivacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--
CREATE TABLE `empresas` (
  `id_empresa` int(11) NOT NULL,
  `nombre_tienda` varchar(100) NOT NULL,
  `ruc_empresa` varchar(20) DEFAULT NULL,
  `direccion_legal` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email_contacto` varchar(100) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `estado_aprobacion` varchar(20) NOT NULL DEFAULT 'Pendiente',
  `tasa_comision` decimal(5,2) NOT NULL DEFAULT 0.15,
  `estado` bit(1) NOT NULL,
  `modulos_activos` text DEFAULT NULL,
  `plan_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresas`
--
INSERT INTO `empresas` (`id_empresa`, `nombre_tienda`, `ruc_empresa`, `direccion_legal`, `telefono`, `email_contacto`, `fecha_registro`, `estado_aprobacion`, `tasa_comision`, `estado`, `modulos_activos`, `plan_id`) VALUES
(1, 'TapStyle - Gentle Elegance', '20123456789', 'Jr. Fashion #101, Lima, Perú', '987654321', 'info@tapstyle-ge.com', '2025-12-01 07:02:00', 'Suspendida', 0.15, b'0', NULL, NULL),
(2, 'TapStyle - Glamour Time', '20987654321', 'Av. Style #202, Lima, Perú', '987654322', 'info@tapstyle-gt.com', '2025-12-01 07:02:00', 'Aprobada', 0.15, b'0', NULL, NULL),
(3, 'TapStyle - Performance Footwear', '20555666777', 'Calle Deporte #303, Lima, Perú', '987654323', 'info@tapstyle-pf.com', '2025-12-01 07:02:00', 'Aprobada', 0.12, b'0', NULL, NULL),
(4, 'TapStyle - Street Vibe', '20888999000', 'Av. Urban #404, Lima, Perú', '987654324', 'info@tapstyle-sv.com', '2025-12-01 07:02:00', 'Aprobada', 0.15, b'0', NULL, NULL),
(5, 'TapStyle - Sistema', '20000000000', 'Lima, Perú', '999000000', 'info@tapstyle.com', '2025-12-01 12:02:12', 'Aprobada', 0.15, b'0', NULL, NULL),
(122, 'SANTIS', '85789734934', 'jr peru 456', '345678213', 'san@gmail.com', '2025-12-06 04:16:46', 'Pendiente', 0.02, b'1', 'DASHBOARD,CATALOGO', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturascomision`
--
CREATE TABLE `facturascomision` (
  `id_factura_comision` bigint(20) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `numero_factura` varchar(20) NOT NULL,
  `periodo_inicio` date NOT NULL,
  `periodo_fin` date NOT NULL,
  `total_ventas_periodo` decimal(10,2) NOT NULL,
  `porcentaje_comision` decimal(5,2) NOT NULL,
  `monto_comision` decimal(10,2) NOT NULL,
  `fecha_emision` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_vencimiento` date NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Pendiente',
  `fecha_pago` datetime DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturassuscripcion`
--
CREATE TABLE `facturassuscripcion` (
  `id_factura_suscripcion` bigint(20) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `id_suscripcion` bigint(20) NOT NULL,
  `numero_factura` varchar(20) NOT NULL,
  `periodo_inicio` date NOT NULL,
  `periodo_fin` date NOT NULL,
  `monto_suscripcion` decimal(10,2) NOT NULL,
  `fecha_emision` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_vencimiento` date NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Pendiente',
  `fecha_pago` datetime DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--
CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `cantidad_stock` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) NOT NULL DEFAULT 5,
  `fecha_ultima_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcasproducto`
--
CREATE TABLE `marcasproducto` (
  `id_marca` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `nombre_marca` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marcasproducto`
--
INSERT INTO `marcasproducto` (`id_marca`, `id_empresa`, `nombre_marca`) VALUES
(2, 1, 'Adidas'),
(1, 1, 'Nike'),
(3, 1, 'Puma'),
(5, 2, 'Calvin Klein'),
(4, 2, 'Tommy Hilfiger'),
(6, 3, 'Converse'),
(7, 3, 'Vans'),
(9, 4, 'Chanel'),
(8, 4, 'Gucci');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materialesproducto`
--
CREATE TABLE `materialesproducto` (
  `id_material` int(11) NOT NULL,
  `nombre_material` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materialesproducto`
--
INSERT INTO `materialesproducto` (`id_material`, `nombre_material`) VALUES
(1, 'Algodón'),
(3, 'Cuero'),
(4, 'Denim'),
(6, 'Lana'),
(7, 'Nylon'),
(2, 'Poliéster'),
(5, 'Spandex');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelos`
--
CREATE TABLE `modelos` (
  `id_modelo` int(11) NOT NULL,
  `nombre_modelo` varchar(100) NOT NULL,
  `id_marca` int(11) NOT NULL,
  `imagen_principal` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulosistema`
--
CREATE TABLE `modulosistema` (
  `id_modulo` int(11) NOT NULL,
  `nombre_modulo` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `orden_menu` int(11) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulosistema`
--
INSERT INTO `modulosistema` (`id_modulo`, `nombre_modulo`, `descripcion`, `icono`, `orden_menu`, `estado`) VALUES
(1, 'DASHBOARD', 'Panel principal', 'fas fa-chart-pie', 1, 1),
(2, 'CATALOGO', 'Gestión de productos', 'fas fa-box', 2, 1),
(3, 'OPERACIONES', 'Pedidos y envíos', 'fas fa-truck', 3, 1),
(4, 'FINANZAS', 'Balance y comisiones', 'fas fa-wallet', 4, 1),
(5, 'ADMINISTRACION', 'Configuración', 'fas fa-cogs', 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientoscaja`
--
CREATE TABLE `movimientoscaja` (
  `id_movimiento_caja` bigint(20) NOT NULL,
  `id_caja` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_movimiento` datetime NOT NULL DEFAULT current_timestamp(),
  `tipo_movimiento` varchar(10) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_comprobante` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientosinventario`
--
CREATE TABLE `movimientosinventario` (
  `id_movimiento_inv` bigint(20) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `id_almacen` int(11) DEFAULT NULL,
  `id_tipo_movimiento` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha_movimiento` datetime NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `referencia_doc` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagoscomprobante`
--
CREATE TABLE `pagoscomprobante` (
  `id_pago` bigint(20) NOT NULL,
  `id_comprobante` bigint(20) NOT NULL,
  `id_tipopago` int(11) NOT NULL,
  `monto_pagado` decimal(10,2) NOT NULL,
  `referencia_pago` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagosempresaatapstyle`
--
CREATE TABLE `pagosempresaatapstyle` (
  `id_pago` bigint(20) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `tipo_pago` varchar(20) NOT NULL,
  `id_factura_suscripcion` bigint(20) DEFAULT NULL,
  `id_factura_comision` bigint(20) DEFAULT NULL,
  `monto_pagado` decimal(10,2) NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT current_timestamp(),
  `metodo_pago` varchar(50) NOT NULL,
  `referencia_pago` varchar(100) DEFAULT NULL,
  `comprobante_pago` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidoscompra`
--
CREATE TABLE `pedidoscompra` (
  `id_pedido_compra` bigint(20) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_pedido` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega_esperada` date DEFAULT NULL,
  `estado_pedido` varchar(50) NOT NULL DEFAULT 'Pendiente',
  `total_pedido` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--
CREATE TABLE `permisos` (
  `id_permiso` int(11) NOT NULL,
  `nombre_permiso` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--
INSERT INTO `permisos` (`id_permiso`, `nombre_permiso`, `descripcion`) VALUES
(1, 'CREAR_EMPRESA', 'Permiso para crear nuevas empresas'),
(2, 'EDITAR_EMPRESA', 'Permiso para editar información de empresa'),
(3, 'ELIMINAR_EMPRESA', 'Permiso para eliminar empresas'),
(4, 'GESTIONAR_USUARIOS', 'Permiso para gestionar usuarios'),
(5, 'GESTIONAR_ROLES', 'Permiso para gestionar roles y permisos'),
(6, 'VER_REPORTES', 'Permiso para ver reportes'),
(7, 'GENERAR_REPORTES', 'Permiso para generar reportes'),
(8, 'GESTIONAR_PRODUCTOS', 'Permiso para CRUD de productos'),
(9, 'GESTIONAR_INVENTARIO', 'Permiso para gestionar inventario'),
(10, 'GESTIONAR_PROVEEDORES', 'Permiso para CRUD de proveedores'),
(11, 'GESTIONAR_CLIENTES', 'Permiso para CRUD de clientes'),
(12, 'VER_VENTAS', 'Permiso para ver registro de ventas'),
(13, 'REALIZAR_VENTAS', 'Permiso para procesar ventas'),
(14, 'GESTIONAR_CAJA', 'Permiso para gestionar caja'),
(15, 'APROBAR_PAGOS', 'Permiso para aprobar pagos'),
(16, 'VER_FINANZAS', 'Permiso para ver información financiera');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--
CREATE TABLE `planes` (
  `id_plan` bigint(20) NOT NULL,
  `nombre_plan` varchar(255) NOT NULL,
  `precio_mensual` decimal(38,2) DEFAULT NULL,
  `comision_adicional` decimal(38,2) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planes`
--
INSERT INTO `planes` (`id_plan`, `nombre_plan`, `precio_mensual`, `comision_adicional`, `descripcion`, `estado`) VALUES
(1, 'Básico', 199.00, 0.02, 'Emprendedores', 1),
(2, 'Premium', 399.00, 0.02, 'Crecimiento', 1),
(3, 'Enterprise', 799.00, 0.01, 'Corporativo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan_modulos`
--
CREATE TABLE `plan_modulos` (
  `id_plan` bigint(20) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `incluido` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plan_modulos`
--
INSERT INTO `plan_modulos` (`id_plan`, `id_modulo`, `incluido`) VALUES
(1, 1, 1),
(1, 2, 1),
(2, 1, 1),
(2, 2, 1),
(2, 3, 1),
(2, 4, 1),
(3, 1, 1),
(3, 2, 1),
(3, 3, 1),
(3, 4, 1),
(3, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `id_unidad_medida` int(11) NOT NULL,
  `dimensiones` varchar(50) DEFAULT NULL,
  `peso_gramos` int(11) DEFAULT NULL,
  `id_marca` int(11) DEFAULT NULL,
  `id_modelo` int(11) DEFAULT NULL,
  `id_material` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--
CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `razon_social` varchar(255) NOT NULL,
  `nombre_comercial` varchar(100) DEFAULT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `rubro` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--
INSERT INTO `proveedores` (`id_proveedor`, `id_empresa`, `razon_social`, `nombre_comercial`, `ruc`, `rubro`, `direccion`, `telefono`, `email`) VALUES
(1, 5, 'Distribuidor Premium SPA', 'Premium', '20123456700', 'Textil', 'Jr. Industrial #500', '987000001', 'proveedor@premium.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor_metodospago`
--
CREATE TABLE `proveedor_metodospago` (
  `id_proveedor` int(11) NOT NULL,
  `id_tipopago` int(11) NOT NULL,
  `datos_pago` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--
CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--
INSERT INTO `roles` (`id_rol`, `nombre_rol`, `estado`, `descripcion`) VALUES
(1, 'SuperAdmin', 1, 'Administrador del sistema con acceso total'),
(2, 'Admin', 1, 'Administrador de empresa con control completo'),
(3, 'Vendedor', 1, 'Personal de ventas con acceso a inventario'),
(4, 'Empleado', 1, 'Empleado general con permisos limitados'),
(5, 'Cliente', 1, 'Cliente registrado de la tienda');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_permisos`
--
CREATE TABLE `rol_permisos` (
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_permisos`
--
INSERT INTO `rol_permisos` (`id_rol`, `id_permiso`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(2, 2),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(3, 8),
(3, 9),
(3, 12),
(3, 13),
(3, 14),
(4, 9),
(4, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suscripcionesempresa`
--
CREATE TABLE `suscripcionesempresa` (
  `id_suscripcion` bigint(20) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `id_plan` bigint(20) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `precio_acordado` decimal(38,2) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `suscripcionesempresa`
--
INSERT INTO `suscripcionesempresa` (`id_suscripcion`, `id_empresa`, `id_plan`, `fecha_inicio`, `fecha_vencimiento`, `precio_acordado`, `estado`, `fecha_creacion`) VALUES
(4, 122, 1, '2025-12-06', '2026-01-06', 199.00, 'Pagado', '2025-12-06 17:06:30'),
(6, 122, 1, '2025-12-06', '2026-01-06', 199.00, 'Activa', '2025-12-06 19:35:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipodocumento`
--
CREATE TABLE `tipodocumento` (
  `id_tipodocumento` int(11) NOT NULL,
  `nombre_tipodocumento` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipodocumento`
--
INSERT INTO `tipodocumento` (`id_tipodocumento`, `nombre_tipodocumento`) VALUES
(1, 'DNI'),
(4, 'Licencia'),
(5, 'Otro'),
(3, 'Pasaporte'),
(2, 'RUC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposcomprobantepago`
--
CREATE TABLE `tiposcomprobantepago` (
  `id_tipo_comprobante` int(11) NOT NULL,
  `nombre_tipo` varchar(50) NOT NULL,
  `serie_documento` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposmovimientoinventario`
--
CREATE TABLE `tiposmovimientoinventario` (
  `id_tipo_movimiento` int(11) NOT NULL,
  `nombre_tipo` varchar(50) NOT NULL,
  `es_entrada` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipospago`
--
CREATE TABLE `tipospago` (
  `id_tipopago` int(11) NOT NULL,
  `tipo_pago` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposproducto`
--
CREATE TABLE `tiposproducto` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidadesmedida`
--
CREATE TABLE `unidadesmedida` (
  `id_unidad_medida` int(11) NOT NULL,
  `nombre_unidad` varchar(50) NOT NULL,
  `abreviatura` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidadesmedida`
--
INSERT INTO `unidadesmedida` (`id_unidad_medida`, `nombre_unidad`, `abreviatura`) VALUES
(1, 'Unidad', 'UND'),
(2, 'Docena', 'DOC'),
(3, 'Caja', 'CJA'),
(4, 'Metro', 'MTR');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `id_tipodocumento` int(11) DEFAULT NULL,
  `numero_documento` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña_hash` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_ultima_sesion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--
INSERT INTO `usuarios` (`id_usuario`, `id_empresa`, `id_rol`, `nombres`, `apellidos`, `id_tipodocumento`, `numero_documento`, `celular`, `direccion`, `username`, `email`, `contraseña_hash`, `estado`, `fecha_creacion`, `fecha_ultima_sesion`) VALUES
(90, 5, 1, 'Santiago', 'Ponce', NULL, NULL, NULL, NULL, 'Santi', 'santi@tapstyle.com', '$2a$10$soeIL/AQhk.hY1Wxj3HP6uYxUpUD8LwUXR9wQFaVckHHHyqGlzjJK', 1, '2025-12-02 08:34:21', NULL),
(535, 122, 2, 'Santiago', 'Ponce', NULL, NULL, NULL, NULL, 'san', 'san@gmail.com', '$2a$10$xsuOm.PDfXJV4vfjAC5pPuRtCed89EINIOW5JdhacoAOEuGSgHPFK', 1, '2025-12-06 04:16:46', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `variantesproducto`
--
CREATE TABLE `variantesproducto` (
  `id_variante` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `codigo_sku` varchar(50) DEFAULT NULL,
  `talla` varchar(10) NOT NULL,
  `color` varchar(50) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `costo_compra` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `almacenes`
--
ALTER TABLE `almacenes`
  ADD PRIMARY KEY (`id_almacen`),
  ADD UNIQUE KEY `UQ_Almacen_Empresa_Nombre` (`id_empresa`,`nombre_almacen`),
  ADD KEY `FK_Almacenes_Empresas` (`id_empresa`);

--
-- Indices de la tabla `aperturascaja`
--
ALTER TABLE `aperturascaja`
  ADD PRIMARY KEY (`id_apertura`),
  ADD UNIQUE KEY `UQ_AperturaCaja_Caja_Fecha` (`id_caja`,`fecha_apertura`),
  ADD KEY `FK_AperturasCaja_Usuarios` (`id_usuario`),
  ADD KEY `FK_AperturasCaja_Cajas` (`id_caja`);

--
-- Indices de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD PRIMARY KEY (`id_bitacora`),
  ADD KEY `FK_Bitacora_Usuarios` (`id_usuario`);

--
-- Indices de la tabla `cajas`
--
ALTER TABLE `cajas`
  ADD PRIMARY KEY (`id_caja`),
  ADD UNIQUE KEY `UQ_Caja_Empresa_Nombre` (`id_empresa`,`nombre_caja`),
  ADD KEY `FK_Cajas_Empresas` (`id_empresa`);

--
-- Indices de la tabla `categoriasproducto`
--
ALTER TABLE `categoriasproducto`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre_categoria` (`nombre_categoria`);

--
-- Indices de la tabla `cierrescaja`
--
ALTER TABLE `cierrescaja`
  ADD PRIMARY KEY (`id_cierre`),
  ADD UNIQUE KEY `id_apertura` (`id_apertura`),
  ADD KEY `FK_CierresCaja_Cajas` (`id_caja`),
  ADD KEY `FK_CierresCaja_Usuarios` (`id_usuario`),
  ADD KEY `FK_CierresCaja_Aperturas` (`id_apertura`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD UNIQUE KEY `UQ_Clientes_Documento` (`id_tipodocumento`,`numero_documento`),
  ADD KEY `FK_Clientes_TipoDocumento` (`id_tipodocumento`),
  ADD KEY `FK_Clientes_Usuarios` (`id_usuario`);

--
-- Indices de la tabla `comprobantespago`
--
ALTER TABLE `comprobantespago`
  ADD PRIMARY KEY (`id_comprobante`),
  ADD UNIQUE KEY `UQ_Comprobante_Tipo_Numero` (`id_tipo_comprobante`,`numero_comprobante`),
  ADD KEY `FK_Comprobantes_Empresas` (`id_empresa`),
  ADD KEY `FK_Comprobantes_Clientes` (`id_cliente`),
  ADD KEY `FK_Comprobantes_Usuarios` (`id_usuario`),
  ADD KEY `FK_Comprobantes_TiposComprobante` (`id_tipo_comprobante`);

--
-- Indices de la tabla `detallescomprobantepago`
--
ALTER TABLE `detallescomprobantepago`
  ADD PRIMARY KEY (`id_detalle_comprobante`),
  ADD KEY `FK_DetallesComprobante_Comprobantes` (`id_comprobante`),
  ADD KEY `FK_DetallesComprobante_Variantes` (`id_variante`);

--
-- Indices de la tabla `detallespedidocompra`
--
ALTER TABLE `detallespedidocompra`
  ADD PRIMARY KEY (`id_detalle_pedido`),
  ADD UNIQUE KEY `UQ_DetallePedido_Pedido_Variante` (`id_pedido_compra`,`id_variante`),
  ADD KEY `FK_DetallesPedidoCompra_Variantes` (`id_variante`),
  ADD KEY `FK_DetallesPedidoCompra_Pedidos` (`id_pedido_compra`);

--
-- Indices de la tabla `empresamodulos`
--
ALTER TABLE `empresamodulos`
  ADD PRIMARY KEY (`id_empresa`,`id_modulo`),
  ADD KEY `FK_EmpresaModulos_Modulos` (`id_modulo`),
  ADD KEY `FK_EmpresaModulos_Empresas` (`id_empresa`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `nombre_tienda` (`nombre_tienda`),
  ADD UNIQUE KEY `ruc_empresa` (`ruc_empresa`);

--
-- Indices de la tabla `facturascomision`
--
ALTER TABLE `facturascomision`
  ADD PRIMARY KEY (`id_factura_comision`),
  ADD UNIQUE KEY `numero_factura` (`numero_factura`),
  ADD KEY `FK_FacturasComision_Empresas` (`id_empresa`);

--
-- Indices de la tabla `facturassuscripcion`
--
ALTER TABLE `facturassuscripcion`
  ADD PRIMARY KEY (`id_factura_suscripcion`),
  ADD UNIQUE KEY `numero_factura` (`numero_factura`),
  ADD KEY `FK_FacturasSusc_Empresas` (`id_empresa`),
  ADD KEY `FK_FacturasSusc_Suscripciones` (`id_suscripcion`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD UNIQUE KEY `UQ_Inventario_Variante_Almacen` (`id_variante`,`id_almacen`),
  ADD KEY `FK_Inventario_Almacenes` (`id_almacen`),
  ADD KEY `FK_Inventario_Variantes` (`id_variante`); -- Corregido: Referencia a variantesproducto

--
-- Indices de la tabla `marcasproducto`
--
ALTER TABLE `marcasproducto`
  ADD PRIMARY KEY (`id_marca`),
  ADD UNIQUE KEY `UQ_Marca_Empresa` (`id_empresa`,`nombre_marca`),
  ADD KEY `FK_Marcas_Empresas` (`id_empresa`);

--
-- Indices de la tabla `materialesproducto`
--
ALTER TABLE `materialesproducto`
  ADD PRIMARY KEY (`id_material`),
  ADD UNIQUE KEY `nombre_material` (`nombre_material`);

--
-- Indices de la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD PRIMARY KEY (`id_modelo`),
  ADD KEY `FK_Modelos_Marcas` (`id_marca`);

--
-- Indices de la tabla `modulosistema`
--
ALTER TABLE `modulosistema`
  ADD PRIMARY KEY (`id_modulo`),
  ADD UNIQUE KEY `nombre_modulo` (`nombre_modulo`);

--
-- Indices de la tabla `movimientoscaja`
--
ALTER TABLE `movimientoscaja`
  ADD PRIMARY KEY (`id_movimiento_caja`),
  ADD KEY `FK_MovimientosCaja_Cajas` (`id_caja`),
  ADD KEY `FK_MovimientosCaja_Usuarios` (`id_usuario`),
  ADD KEY `FK_MovimientosCaja_Comprobantes` (`id_comprobante`);

--
-- Indices de la tabla `movimientosinventario`
--
ALTER TABLE `movimientosinventario`
  ADD PRIMARY KEY (`id_movimiento_inv`),
  ADD KEY `FK_MovInv_Variantes` (`id_variante`),
  ADD KEY `FK_MovInv_Almacenes` (`id_almacen`),
  ADD KEY `FK_MovInv_TiposMovimiento` (`id_tipo_movimiento`),
  ADD KEY `FK_MovInv_Usuarios` (`id_usuario`);

--
-- Indices de la tabla `pagoscomprobante`
--
ALTER TABLE `pagoscomprobante`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `FK_Pagos_Comprobantes` (`id_comprobante`),
  ADD KEY `FK_Pagos_TiposPago` (`id_tipopago`);

--
-- Indices de la tabla `pagosempresaatapstyle`
--
ALTER TABLE `pagosempresaatapstyle`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `FK_PagosEmpresa_Empresas` (`id_empresa`),
  ADD KEY `FK_PagosEmpresa_FactSusc` (`id_factura_suscripcion`),
  ADD KEY `FK_PagosEmpresa_FactComision` (`id_factura_comision`);

--
-- Indices de la tabla `pedidoscompra`
--
ALTER TABLE `pedidoscompra`
  ADD PRIMARY KEY (`id_pedido_compra`),
  ADD KEY `FK_PedidosCompra_Proveedores` (`id_proveedor`),
  ADD KEY `FK_PedidosCompra_Usuarios` (`id_usuario`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_permiso`),
  ADD UNIQUE KEY `nombre_permiso` (`nombre_permiso`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id_plan`);

--
-- Indices de la tabla `plan_modulos`
--
ALTER TABLE `plan_modulos`
  ADD PRIMARY KEY (`id_plan`,`id_modulo`),
  ADD KEY `FK_PM_Modulo` (`id_modulo`),
  ADD KEY `FK_PM_Plan` (`id_plan`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `UQ_Producto_Empresa_Nombre` (`id_empresa`,`nombre_producto`),
  ADD KEY `FK_Productos_Proveedores` (`id_proveedor`),
  ADD KEY `FK_Productos_Modelos` (`id_modelo`),
  ADD KEY `FK_Productos_Categorias` (`id_categoria`),
  ADD KEY `FK_Productos_Marcas` (`id_marca`),
  ADD KEY `FK_Productos_Materiales` (`id_material`),
  ADD KEY `FK_Productos_UnidadesMedida` (`id_unidad_medida`),
  ADD KEY `FK_Productos_Empresas` (`id_empresa`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD UNIQUE KEY `UQ_Proveedor_Empresa_RUC` (`id_empresa`,`ruc`),
  ADD KEY `FK_Proveedores_Empresas` (`id_empresa`);

--
-- Indices de la tabla `proveedor_metodospago`
--
ALTER TABLE `proveedor_metodospago`
  ADD PRIMARY KEY (`id_proveedor`,`id_tipopago`),
  ADD KEY `FK_ProvMetodos_TipoPago` (`id_tipopago`),
  ADD KEY `FK_ProvMetodos_Proveedor` (`id_proveedor`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indices de la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  ADD PRIMARY KEY (`id_rol`,`id_permiso`),
  ADD KEY `FK_RolPermisos_Permisos` (`id_permiso`),
  ADD KEY `FK_RolPermisos_Roles` (`id_rol`);

--
-- Indices de la tabla `suscripcionesempresa`
--
ALTER TABLE `suscripcionesempresa`
  ADD PRIMARY KEY (`id_suscripcion`),
  ADD KEY `FK_Suscripciones_Empresas` (`id_empresa`),
  ADD KEY `IDX_Suscripciones_Planes` (`id_plan`),
  ADD KEY `FK_Suscripciones_Planes` (`id_plan`);

--
-- Indices de la tabla `tipodocumento`
--
ALTER TABLE `tipodocumento`
  ADD PRIMARY KEY (`id_tipodocumento`),
  ADD UNIQUE KEY `nombre_tipodocumento` (`nombre_tipodocumento`);

--
-- Indices de la tabla `tiposcomprobantepago`
--
ALTER TABLE `tiposcomprobantepago`
  ADD PRIMARY KEY (`id_tipo_comprobante`),
  ADD UNIQUE KEY `nombre_tipo` (`nombre_tipo`);

--
-- Indices de la tabla `tiposmovimientoinventario`
--
ALTER TABLE `tiposmovimientoinventario`
  ADD PRIMARY KEY (`id_tipo_movimiento`),
  ADD UNIQUE KEY `nombre_tipo` (`nombre_tipo`);

--
-- Indices de la tabla `tipospago`
--
ALTER TABLE `tipospago`
  ADD PRIMARY KEY (`id_tipopago`),
  ADD UNIQUE KEY `tipo_pago` (`tipo_pago`);

--
-- Indices de la tabla `tiposproducto`
--
ALTER TABLE `tiposproducto`
  ADD PRIMARY KEY (`id_tipo`),
  ADD UNIQUE KEY `nombre_tipo` (`nombre_tipo`);

--
-- Indices de la tabla `unidadesmedida`
--
ALTER TABLE `unidadesmedida`
  ADD PRIMARY KEY (`id_unidad_medida`),
  ADD UNIQUE KEY `nombre_unidad` (`nombre_unidad`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `UQ_Usuarios_Documento` (`id_tipodocumento`,`numero_documento`),
  ADD KEY `FK_Usuarios_Empresas` (`id_empresa`),
  ADD KEY `FK_Usuarios_Roles` (`id_rol`),
  ADD KEY `FK_Usuarios_TipoDocumento` (`id_tipodocumento`);

--
-- Indices de la tabla `variantesproducto`
--
ALTER TABLE `variantesproducto`
  ADD PRIMARY KEY (`id_variante`),
  ADD UNIQUE KEY `UQ_Variante_Producto_Talla_Color` (`id_producto`,`talla`,`color`),
  ADD UNIQUE KEY `codigo_sku` (`codigo_sku`),
  ADD KEY `FK_Variantes_Productos` (`id_producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--
ALTER TABLE `almacenes`
  MODIFY `id_almacen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

ALTER TABLE `aperturascaja`
  MODIFY `id_apertura` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `bitacora`
  MODIFY `id_bitacora` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cajas`
  MODIFY `id_caja` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categoriasproducto`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

ALTER TABLE `cierrescaja`
  MODIFY `id_cierre` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

ALTER TABLE `comprobantespago`
  MODIFY `id_comprobante` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `detallescomprobantepago`
  MODIFY `id_detalle_comprobante` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `detallespedidocompra`
  MODIFY `id_detalle_pedido` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `empresas`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

ALTER TABLE `facturascomision`
  MODIFY `id_factura_comision` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `facturassuscripcion`
  MODIFY `id_factura_suscripcion` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `inventario`
  MODIFY `id_inventario` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `marcasproducto`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=413;

ALTER TABLE `materialesproducto`
  MODIFY `id_material` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=323;

ALTER TABLE `modelos`
  MODIFY `id_modelo` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `modulosistema`
  MODIFY `id_modulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `movimientoscaja`
  MODIFY `id_movimiento_caja` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `movimientosinventario`
  MODIFY `id_movimiento_inv` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pagoscomprobante`
  MODIFY `id_pago` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pagosempresaatapstyle`
  MODIFY `id_pago` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pedidoscompra`
  MODIFY `id_pedido_compra` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `permisos`
  MODIFY `id_permiso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=728;

ALTER TABLE `planes`
  MODIFY `id_plan` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

ALTER TABLE `suscripcionesempresa`
  MODIFY `id_suscripcion` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `tipodocumento`
  MODIFY `id_tipodocumento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

ALTER TABLE `tiposcomprobantepago`
  MODIFY `id_tipo_comprobante` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tiposmovimientoinventario`
  MODIFY `id_tipo_movimiento` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tipospago`
  MODIFY `id_tipopago` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tiposproducto`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `unidadesmedida`
  MODIFY `id_unidad_medida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=774;

ALTER TABLE `variantesproducto`
  MODIFY `id_variante` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas (Claves Foráneas corregidas)
--

--
-- Filtros para la tabla `almacenes`
--
ALTER TABLE `almacenes`
  ADD CONSTRAINT `FK_Almacenes_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`);

--
-- Filtros para la tabla `aperturascaja`
--
ALTER TABLE `aperturascaja`
  ADD CONSTRAINT `FK_AperturasCaja_Cajas` FOREIGN KEY (`id_caja`) REFERENCES `cajas` (`id_caja`),
  ADD CONSTRAINT `FK_AperturasCaja_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD CONSTRAINT `FK_Bitacora_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `cajas`
--
ALTER TABLE `cajas`
  ADD CONSTRAINT `FK_Cajas_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`);

--
-- Filtros para la tabla `cierrescaja`
--
ALTER TABLE `cierrescaja`
  ADD CONSTRAINT `FK_CierresCaja_Aperturas` FOREIGN KEY (`id_apertura`) REFERENCES `aperturascaja` (`id_apertura`),
  ADD CONSTRAINT `FK_CierresCaja_Cajas` FOREIGN KEY (`id_caja`) REFERENCES `cajas` (`id_caja`),
  ADD CONSTRAINT `FK_CierresCaja_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `FK_Clientes_TipoDocumento` FOREIGN KEY (`id_tipodocumento`) REFERENCES `tipodocumento` (`id_tipodocumento`),
  ADD CONSTRAINT `FK_Clientes_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `comprobantespago`
--
ALTER TABLE `comprobantespago`
  ADD CONSTRAINT `FK_Comprobantes_Clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `FK_Comprobantes_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  ADD CONSTRAINT `FK_Comprobantes_TiposComprobante` FOREIGN KEY (`id_tipo_comprobante`) REFERENCES `tiposcomprobantepago` (`id_tipo_comprobante`),
  ADD CONSTRAINT `FK_Comprobantes_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `detallescomprobantepago`
--
ALTER TABLE `detallescomprobantepago`
  ADD CONSTRAINT `FK_DetallesComprobante_Comprobantes` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobantespago` (`id_comprobante`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DetallesComprobante_Variantes` FOREIGN KEY (`id_variante`) REFERENCES `variantesproducto` (`id_variante`);

--
-- Filtros para la tabla `detallespedidocompra`
--
ALTER TABLE `detallespedidocompra`
  ADD CONSTRAINT `FK_DetallesPedidoCompra_Pedidos` FOREIGN KEY (`id_pedido_compra`) REFERENCES `pedidoscompra` (`id_pedido_compra`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_DetallesPedidoCompra_Variantes` FOREIGN KEY (`id_variante`) REFERENCES `variantesproducto` (`id_variante`);

--
-- Filtros para la tabla `empresamodulos`
--
ALTER TABLE `empresamodulos`
  ADD CONSTRAINT `FK_EmpresaModulos_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EmpresaModulos_Modulos` FOREIGN KEY (`id_modulo`) REFERENCES `modulosistema` (`id_modulo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `facturascomision`
--
ALTER TABLE `facturascomision`
  ADD CONSTRAINT `FK_FacturasComision_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`);

--
-- Filtros para la tabla `facturassuscripcion`
--
ALTER TABLE `facturassuscripcion`
  ADD CONSTRAINT `FK_FacturasSusc_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  ADD CONSTRAINT `FK_FacturasSusc_Suscripciones` FOREIGN KEY (`id_suscripcion`) REFERENCES `suscripcionesempresa` (`id_suscripcion`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `FK_Inventario_Almacenes` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Inventario_Variantes` FOREIGN KEY (`id_variante`) REFERENCES `variantesproducto` (`id_variante`) ON DELETE CASCADE;

--
-- Filtros para la tabla `marcasproducto`
--
ALTER TABLE `marcasproducto`
  ADD CONSTRAINT `FK_Marcas_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`);

--
-- Filtros para la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD CONSTRAINT `FK_Modelos_Marcas` FOREIGN KEY (`id_marca`) REFERENCES `marcasproducto` (`id_marca`);

--
-- Filtros para la tabla `movimientoscaja`
--
ALTER TABLE `movimientoscaja`
  ADD CONSTRAINT `FK_MovimientosCaja_Cajas` FOREIGN KEY (`id_caja`) REFERENCES `cajas` (`id_caja`),
  ADD CONSTRAINT `FK_MovimientosCaja_Comprobantes` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobantespago` (`id_comprobante`),
  ADD CONSTRAINT `FK_MovimientosCaja_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `movimientosinventario`
--
ALTER TABLE `movimientosinventario`
  ADD CONSTRAINT `FK_MovInv_Almacenes` FOREIGN KEY (`id_almacen`) REFERENCES `almacenes` (`id_almacen`),
  ADD CONSTRAINT `FK_MovInv_TiposMovimiento` FOREIGN KEY (`id_tipo_movimiento`) REFERENCES `tiposmovimientoinventario` (`id_tipo_movimiento`),
  ADD CONSTRAINT `FK_MovInv_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `FK_MovInv_Variantes` FOREIGN KEY (`id_variante`) REFERENCES `variantesproducto` (`id_variante`);

--
-- Filtros para la tabla `pagoscomprobante`
--
ALTER TABLE `pagoscomprobante`
  ADD CONSTRAINT `FK_Pagos_Comprobantes` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobantespago` (`id_comprobante`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Pagos_TiposPago` FOREIGN KEY (`id_tipopago`) REFERENCES `tipospago` (`id_tipopago`);

--
-- Filtros para la tabla `pagosempresaatapstyle`
--
ALTER TABLE `pagosempresaatapstyle`
  ADD CONSTRAINT `FK_PagosEmpresa_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  ADD CONSTRAINT `FK_PagosEmpresa_FactComision` FOREIGN KEY (`id_factura_comision`) REFERENCES `facturascomision` (`id_factura_comision`),
  ADD CONSTRAINT `FK_PagosEmpresa_FactSusc` FOREIGN KEY (`id_factura_suscripcion`) REFERENCES `facturassuscripcion` (`id_factura_suscripcion`);

--
-- Filtros para la tabla `pedidoscompra`
--
ALTER TABLE `pedidoscompra`
  ADD CONSTRAINT `FK_PedidosCompra_Proveedores` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  ADD CONSTRAINT `FK_PedidosCompra_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `plan_modulos`
--
ALTER TABLE `plan_modulos`
  ADD CONSTRAINT `FK_PM_Modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulosistema` (`id_modulo`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_PM_Plan` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `FK_Productos_Categorias` FOREIGN KEY (`id_categoria`) REFERENCES `categoriasproducto` (`id_categoria`),
  ADD CONSTRAINT `FK_Productos_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  ADD CONSTRAINT `FK_Productos_Marcas` FOREIGN KEY (`id_marca`) REFERENCES `marcasproducto` (`id_marca`),
  ADD CONSTRAINT `FK_Productos_Materiales` FOREIGN KEY (`id_material`) REFERENCES `materialesproducto` (`id_material`),
  ADD CONSTRAINT `FK_Productos_Modelos` FOREIGN KEY (`id_modelo`) REFERENCES `modelos` (`id_modelo`),
  ADD CONSTRAINT `FK_Productos_Proveedores` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  ADD CONSTRAINT `FK_Productos_UnidadesMedida` FOREIGN KEY (`id_unidad_medida`) REFERENCES `unidadesmedida` (`id_unidad_medida`);

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `FK_Proveedores_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`);

--
-- Filtros para la tabla `proveedor_metodospago`
--
ALTER TABLE `proveedor_metodospago`
  ADD CONSTRAINT `FK_ProvMetodos_Proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ProvMetodos_TipoPago` FOREIGN KEY (`id_tipopago`) REFERENCES `tipospago` (`id_tipopago`) ON DELETE CASCADE;

--
-- Filtros para la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  ADD CONSTRAINT `FK_RolPermisos_Permisos` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_RolPermisos_Roles` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE;

--
-- Filtros para la tabla `suscripcionesempresa`
--
ALTER TABLE `suscripcionesempresa`
  ADD CONSTRAINT `FK_Suscripciones_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  ADD CONSTRAINT `FK_Suscripciones_Planes` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `FK_Usuarios_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  ADD CONSTRAINT `FK_Usuarios_Roles` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `FK_Usuarios_TipoDocumento` FOREIGN KEY (`id_tipodocumento`) REFERENCES `tipodocumento` (`id_tipodocumento`);

--
-- Filtros para la tabla `variantesproducto`
--
ALTER TABLE `variantesproducto`
  ADD CONSTRAINT `FK_Variantes_Productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;