-- ==================================================
-- SISTEMA DE CARRITO Y PEDIDOS PARA CLIENTES
-- ==================================================

-- Tabla de Carritos de Compras
CREATE TABLE `carritos` (
  `id_carrito` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `estado` varchar(20) NOT NULL DEFAULT 'Activo' COMMENT 'Activo, Convertido, Abandonado',
  PRIMARY KEY (`id_carrito`),
  UNIQUE KEY `UK_Usuario_Empresa` (`id_usuario`, `id_empresa`),
  KEY `FK_Carritos_Usuarios` (`id_usuario`),
  KEY `FK_Carritos_Empresas` (`id_empresa`),
  CONSTRAINT `FK_Carritos_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `FK_Carritos_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de Items del Carrito
CREATE TABLE `items_carrito` (
  `id_item_carrito` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_carrito` int(11) NOT NULL,
  `id_variante` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `fecha_agregado` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_item_carrito`),
  UNIQUE KEY `UK_Carrito_Variante` (`id_carrito`, `id_variante`),
  KEY `FK_ItemsCarrito_Carritos` (`id_carrito`),
  KEY `FK_ItemsCarrito_Variantes` (`id_variante`),
  CONSTRAINT `FK_ItemsCarrito_Carritos` FOREIGN KEY (`id_carrito`) REFERENCES `carritos` (`id_carrito`) ON DELETE CASCADE,
  CONSTRAINT `FK_ItemsCarrito_Variantes` FOREIGN KEY (`id_variante`) REFERENCES `variantesproducto` (`id_variante`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de Pedidos de Clientes
CREATE TABLE `pedidos_clientes` (
  `id_pedido` bigint(20) NOT NULL AUTO_INCREMENT,
  `numero_pedido` varchar(50) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `fecha_pedido` datetime NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) NOT NULL,
  `igv` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Pendiente' COMMENT 'Pendiente, Procesando, Completado, Cancelado',
  `direccion_envio` varchar(255) DEFAULT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  UNIQUE KEY `UK_NumeroPedido` (`numero_pedido`),
  KEY `FK_PedidosClientes_Usuarios` (`id_usuario`),
  KEY `FK_PedidosClientes_Empresas` (`id_empresa`),
  KEY `FK_PedidosClientes_Clientes` (`id_cliente`),
  CONSTRAINT `FK_PedidosClientes_Usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `FK_PedidosClientes_Empresas` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  CONSTRAINT `FK_PedidosClientes_Clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de Detalles de Pedidos
CREATE TABLE `detalles_pedido_cliente` (
  `id_detalle` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_pedido` bigint(20) NOT NULL,
  `id_variante` bigint(20) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal_linea` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `FK_DetallesPedido_Pedidos` (`id_pedido`),
  KEY `FK_DetallesPedido_Variantes` (`id_variante`),
  CONSTRAINT `FK_DetallesPedido_Pedidos` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos_clientes` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `FK_DetallesPedido_Variantes` FOREIGN KEY (`id_variante`) REFERENCES `variantesproducto` (`id_variante`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabla de Pagos de Pedidos
CREATE TABLE `pagos_pedido` (
  `id_pago_pedido` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_pedido` bigint(20) NOT NULL,
  `id_tipopago` int(11) NOT NULL,
  `monto_pagado` decimal(10,2) NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT current_timestamp(),
  `referencia_pago` varchar(100) DEFAULT NULL COMMENT 'Número de operación, transacción, etc',
  `estado_pago` varchar(20) NOT NULL DEFAULT 'Completado' COMMENT 'Completado, Pendiente, Fallido',
  PRIMARY KEY (`id_pago_pedido`),
  KEY `FK_PagosPedido_Pedidos` (`id_pedido`),
  KEY `FK_PagosPedido_TipoPago` (`id_tipopago`),
  CONSTRAINT `FK_PagosPedido_Pedidos` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos_clientes` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `FK_PagosPedido_TipoPago` FOREIGN KEY (`id_tipopago`) REFERENCES `tipo_pago` (`id_tipo_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Índices adicionales para mejorar rendimiento
CREATE INDEX idx_pedidos_fecha ON pedidos_clientes(fecha_pedido);
CREATE INDEX idx_pedidos_estado ON pedidos_clientes(estado);
CREATE INDEX idx_carritos_estado ON carritos(estado);
