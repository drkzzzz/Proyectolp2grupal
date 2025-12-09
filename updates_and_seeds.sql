-- 1. AGREGAR COLUMNA PRECIO A LA TABLA PRODUCTOS (Si no la has ejecutado aún)
-- Si ya existe, esta línea dará warning o error leve, puedes ignorarla.
ALTER TABLE `productos` ADD COLUMN `precio` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER `descripcion`;

-- 2. INSERTAR DATOS PARA LA EMPRESA "SANTIS" (ID 122)

-- Variables para IDs (Referencia visual, en SQL puro usaremos los literales)
-- id_empresa = 122
-- id_usuario = 535 (Usuario 'san' que ya tienes)

-- Almacenes
INSERT IGNORE INTO `almacenes` (`id_almacen`, `id_empresa`, `nombre_almacen`, `ubicacion`) VALUES 
(100, 122, 'Almacén Principal SANTIS', 'Sede Central');

-- Cajas
INSERT IGNORE INTO `cajas` (`id_caja`, `id_empresa`, `nombre_caja`, `estado`) VALUES 
(100, 122, 'Caja Principal', 'Cerrada');

-- Categorías (Globales, aseguramos que existan algunas)
INSERT IGNORE INTO `categoriasproducto` (`id_categoria`, `nombre_categoria`, `descripcion`) VALUES 
(50, 'Zapatillas', 'Calzado deportivo'),
(51, 'Polos', 'Polos de algodón'),
(52, 'Jeans', 'Pantalones denim'),
(146, 'General', 'Categoría General');

-- Marcas (Específicas de la empresa 122)
INSERT IGNORE INTO `marcasproducto` (`id_marca`, `id_empresa`, `nombre_marca`) VALUES 
(50, 122, 'Nike'), 
(51, 122, 'Adidas'), 
(52, 122, 'Puma');

-- Unidades de Medida (Globales)
INSERT IGNORE INTO `unidadesmedida` (`id_unidad_medida`, `nombre_unidad`, `abreviatura`) VALUES 
(50, 'Par', 'PAR'),
(51, 'Unidad', 'UND'),
(1, 'Unidad', 'UND');

-- Materiales (Globales)
INSERT IGNORE INTO `materialesproducto` (`id_material`, `nombre_material`) VALUES 
(50, 'Cuero'), 
(51, 'Algodón');

-- Modelos (Ligados a Marcas de la empresa 122)
INSERT IGNORE INTO `modelos` (`id_modelo`, `nombre_modelo`, `id_marca`) VALUES 
(50, 'Air Max', 50),
(51, 'Superstar', 51);

-- Proveedores (Específicos de la empresa 122)
INSERT IGNORE INTO `proveedores` (`id_proveedor`, `id_empresa`, `razon_social`, `ruc`, `telefono`) VALUES 
(50, 122, 'Distribuidora Deportiva SAC', '20100000001', '987654321');

-- PRODUCTOS (Para empresa 122)
INSERT IGNORE INTO `productos` (`id_producto`, `id_empresa`, `nombre_producto`, `descripcion`, `precio`, `id_categoria`, `id_proveedor`, `id_unidad_medida`, `id_marca`, `id_modelo`, `id_material`) VALUES 
(500, 122, 'Zapatilla Nike Air Max', 'Zapatilla urbana', 250.00, 50, 50, 50, 50, 50, 50),
(501, 122, 'Polo Adidas Logo', 'Polo deportivo', 80.00, 51, 50, 51, 51, NULL, 51),
(502, 122, 'Puma Suede Classic', 'Zapatilla clásica', 220.00, 50, 50, 50, 52, NULL, 50);

-- Variantes (SKUs para los productos insertados)
-- id_producto 500
INSERT IGNORE INTO `variantesproducto` (`id_variante`, `id_producto`, `codigo_sku`, `talla`, `color`, `precio_venta`, `costo_compra`) VALUES 
(5000, 500, 'NIKE-AM-40', '40', 'Blanco', 250.00, 150.00),
(5001, 500, 'NIKE-AM-41', '41', 'Blanco', 250.00, 150.00),
-- id_producto 501
(5002, 501, 'ADI-POL-M', 'M', 'Negro', 80.00, 40.00);

-- Inventario (Stock en el almacén 100 de la empresa 122)
INSERT IGNORE INTO `inventario` (`id_inventario`, `id_variante`, `id_almacen`, `cantidad_stock`) VALUES 
(1000, 5000, 100, 20),
(1001, 5001, 100, 15),
(1002, 5002, 100, 50);

-- Tipos de Documento (Asegurar IDs)
INSERT IGNORE INTO `tipodocumento` (`id_tipodocumento`, `nombre_tipodocumento`) VALUES (1, 'DNI');

-- Clientes (Globales, pero usados en transacciones)
INSERT IGNORE INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `numero_documento`, `id_tipodocumento`) VALUES 
(100, 'Cliente', 'Prueba', '10000001', 1);

-- Tipos Comprobante
INSERT IGNORE INTO `tiposcomprobantepago` (`id_tipo_comprobante`, `nombre_tipo`, `serie_documento`) VALUES 
(1, 'Boleta', 'B001'), (2, 'Factura', 'F001');

-- Comprobantes (Venta para empresa 122, usuario 535)
INSERT IGNORE INTO `comprobantespago` (`id_comprobante`, `id_empresa`, `id_cliente`, `id_usuario`, `id_tipo_comprobante`, `numero_comprobante`, `total`, `estado`) VALUES 
(1000, 122, 100, 535, 1, 'B001-00122', 250.00, 'Emitido');

-- Detalle Comprobante
INSERT IGNORE INTO `detallescomprobantepago` (`id_detalle_comprobante`, `id_comprobante`, `id_variante`, `cantidad`, `precio_unitario`, `subtotal_linea`) VALUES 
(1000, 1000, 5000, 1, 250.00, 250.00);
