-- ====================================================================
-- INSERTS ADICIONALES Y PRUEBAS - TAPSTYLE
-- Ejecutar después del script 01-insert-data-initial.sql
-- ====================================================================

-- ====================================================================
-- 17. INSERTAR MÁS PRODUCTOS DE PRUEBA (STOCK BAJO)
-- ====================================================================

-- Producto con stock bajo para pruebas de alertas
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(1, 1, 1, 1, 3, 1, 1, 'Camiseta Premium Roja', 'Camiseta de algodón rojo sangre premium', 16.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(11, 'Camiseta Roja S', 'Talla S color rojo', 'S', 'Rojo', 34.99, 0.00),
(11, 'Camiseta Roja M', 'Talla M color rojo', 'M', 'Rojo', 34.99, 0.00);

-- Insertar inventario con stock bajo (menos de 100)
INSERT INTO Inventarios (id_variante, id_almacen, cantidad_stock, cantidad_minima, cantidad_maxima, estado) VALUES 
(36, 1, 8, 10, 150, TRUE),  -- Bajo stock
(37, 1, 15, 10, 150, TRUE);

-- Producto adicional de prueba
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(2, 8, 3, 1, 6, 5, 1, 'Falda Elegante Negra', 'Falda plisada elegante color negro', 25.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(12, 'Falda Negra XS', 'Talla XS color negro', 'XS', 'Negro', 59.99, 0.00),
(12, 'Falda Negra S', 'Talla S color negro', 'S', 'Negro', 59.99, 0.00),
(12, 'Falda Negra M', 'Talla M color negro', 'M', 'Negro', 59.99, 0.00);

INSERT INTO Inventarios (id_variante, id_almacen, cantidad_stock, cantidad_minima, cantidad_maxima, estado) VALUES 
(38, 3, 5, 10, 100, TRUE),   -- Muy bajo stock
(39, 3, 12, 10, 100, TRUE),
(40, 3, 25, 10, 100, TRUE);

-- ====================================================================
-- 18. INSERTAR REGISTROS DE BITÁCORA (AUDITORÍA)
-- ====================================================================
INSERT INTO Bitacora (id_usuario, accion, detalle_accion, ip_origen) VALUES 
(1, 'LOGIN', 'Usuario superadmin inició sesión', '192.168.1.100'),
(2, 'LOGIN', 'Usuario admin_ge inició sesión', '192.168.1.101'),
(3, 'CREAR_PRODUCTO', 'Se creó producto: Camiseta Básica Premium (ID: 1)', '192.168.1.102'),
(4, 'CREAR_PROVEEDOR', 'Se registró proveedor: Distribuidor Premium SPA', '192.168.1.103'),
(5, 'AJUSTE_INVENTARIO', 'Se ajustó inventario de variante 1: +50 unidades', '192.168.1.104'),
(6, 'CREAR_USUARIO', 'Se creó usuario: vendedor_ge1', '192.168.1.105'),
(7, 'CREAR_CLIENTE', 'Se registró cliente: Cliente Uno', '192.168.1.106'),
(1, 'ACCESO_REPORTES', 'SuperAdmin accedió a reportes de ventas', '192.168.1.100'),
(2, 'MODIFICAR_EMPRESA', 'Se actualizó información de empresa: TapStyle - Gentle Elegance', '192.168.1.101'),
(3, 'ELIMINAR_PRODUCTO', 'Se desactivó producto: Camiseta Roja (ID: 11)', '192.168.1.102');

-- ====================================================================
-- 19. INSERTAR CAJAS (CAJA DIARIA)
-- ====================================================================
INSERT INTO Cajas (id_usuario, id_empresa, fecha_apertura, saldo_inicial, saldo_actual, estado, observaciones) VALUES 
(2, 1, NOW(), 500.00, 1250.50, 'Abierta', 'Caja diaria aperturada'),
(4, 2, NOW(), 1000.00, 2150.75, 'Abierta', 'Caja principal aperturada'),
(6, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), 800.00, 1890.25, 'Cerrada', 'Cierre de caja del día anterior');

-- ====================================================================
-- 20. ESTADÍSTICAS Y VALIDACIONES
-- ====================================================================
-- Verificar que los datos se hayan insertado correctamente
-- SELECCIONA todos los productos con sus variantes
SELECT 
    p.id_producto,
    p.nombre_producto,
    c.nombre_categoria,
    m.nombre_marca,
    p.precio_costo,
    COUNT(v.id_variante) as total_variantes,
    SUM(i.cantidad_stock) as stock_total
FROM Productos p
LEFT JOIN CategoriaProducto c ON p.id_categoria = c.id_categoria
LEFT JOIN Marcas m ON p.id_marca = m.id_marca
LEFT JOIN VarianteProducto v ON p.id_producto = v.id_producto
LEFT JOIN Inventarios i ON v.id_variante = i.id_variante
GROUP BY p.id_producto
ORDER BY p.id_empresa, p.nombre_producto;

-- ====================================================================
-- FIN DE INSERTS ADICIONALES
-- ====================================================================
-- Este script adicional contiene:
-- - 2 productos adicionales de prueba con 5 variantes
-- - 10 registros de bitácora para auditoría
-- - 3 registros de caja para gestión de efectivo
-- - Query de validación para verificar la carga de datos
-- ====================================================================
