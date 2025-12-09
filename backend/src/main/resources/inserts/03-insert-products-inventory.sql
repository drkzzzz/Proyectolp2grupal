-- path: backend/src/main/resources/inserts/03-insert-products-inventory.sql

-- PRODUCTO 1: Casaca Cortaviento (Unidad: 1 - UND)
INSERT INTO Productos (id_empresa, nombre_producto, descripcion, id_categoria, id_unidad_medida, id_marca)
VALUES (122, 'Casaca Cortaviento Pro', 'Casaca ligera para correr, impermeable', 146, 1, 50);

-- VARIANTE P1 (SKU Obligatorio)
INSERT INTO VariantesProducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra)
VALUES ((SELECT MAX(id_producto) FROM Productos WHERE nombre_producto='Casaca Cortaviento Pro'), 'SAN-CAS-NG-M', 'M', 'Negro', 120.00, 60.00);

-- INVENTARIO P1 (Almacén 100)
INSERT INTO Inventario (id_variante, id_almacen, cantidad_stock, stock_minimo, fecha_ultima_actualizacion)
VALUES ((SELECT MAX(id_variante) FROM VariantesProducto WHERE codigo_sku='SAN-CAS-NG-M'), 100, 50, 5, GETDATE());


-- PRODUCTO 2: Medias de Compresión (Unidad: 50 - PAR)
INSERT INTO Productos (id_empresa, nombre_producto, descripcion, id_categoria, id_unidad_medida, id_marca)
VALUES (122, 'Medias Compresión Elite', 'Pack de medias para futbol', 146, 50, 50);

-- VARIANTE P2
INSERT INTO VariantesProducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra)
VALUES ((SELECT MAX(id_producto) FROM Productos WHERE nombre_producto='Medias Compresión Elite'), 'SAN-MED-BL-U', 'U', 'Blanco', 25.00, 10.00);

-- INVENTARIO P2
INSERT INTO Inventario (id_variante, id_almacen, cantidad_stock, stock_minimo, fecha_ultima_actualizacion)
VALUES ((SELECT MAX(id_variante) FROM VariantesProducto WHERE codigo_sku='SAN-MED-BL-U'), 100, 100, 10, GETDATE());


-- PRODUCTO 3: Gorra Sport (Unidad: 1 - UND)
INSERT INTO Productos (id_empresa, nombre_producto, descripcion, id_categoria, id_unidad_medida, id_marca)
VALUES (122, 'Gorra DryFit', 'Gorra ventilada unisex', 12, 1, 50);

-- VARIANTE P3
INSERT INTO VariantesProducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra)
VALUES ((SELECT MAX(id_producto) FROM Productos WHERE nombre_producto='Gorra DryFit'), 'SAN-GOR-AZ-U', 'U', 'Azul', 45.00, 20.00);

-- INVENTARIO P3
INSERT INTO Inventario (id_variante, id_almacen, cantidad_stock, stock_minimo, fecha_ultima_actualizacion)
VALUES ((SELECT MAX(id_variante) FROM VariantesProducto WHERE codigo_sku='SAN-GOR-AZ-U'), 100, 30, 2, GETDATE());