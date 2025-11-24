-- path: backend/src/main/resources/inserts/03-insert-products-inventory.sql

INSERT INTO Almacenes (id_empresa, nombre_almacen, ubicacion)
VALUES ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance'),'Almacén Central GE','Jr. Warehouse #100'),
       ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance'),'Almacén Secundario GE','Av. Segunda #200');

INSERT INTO Productos (id_empresa, nombre_producto, descripcion, id_categoria, id_unidad_medida, dimensiones, peso_gramos, id_marca, id_modelo, id_material)
VALUES ((SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance'),
        'Camiseta Básica Premium','Camiseta de algodón premium',
        (SELECT id_categoria FROM CategoriasProducto WHERE nombre_categoria='Camisetas'),
        (SELECT id_unidad_medida FROM UnidadesMedida WHERE nombre_unidad='Unidad'),
        'S-M-L-XL',200,
        (SELECT TOP 1 id_marca FROM MarcasProducto WHERE nombre_marca='Nike' AND id_empresa=(SELECT id_empresa FROM Empresas WHERE nombre_tienda='TapStyle - Gentle Elegance')),
        (SELECT TOP 1 id_modelo FROM Modelos WHERE nombre_modelo='Clásico'),
        (SELECT id_material FROM MaterialesProducto WHERE nombre_material='Algodón'));

INSERT INTO VariantesProducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra)
VALUES ((SELECT TOP 1 id_producto FROM Productos WHERE nombre_producto='Camiseta Básica Premium'),'SKU-GE-CAM-001','S','Blanco',59.90,30.00),
       ((SELECT TOP 1 id_producto FROM Productos WHERE nombre_producto='Camiseta Básica Premium'),'SKU-GE-CAM-002','M','Blanco',59.90,30.00),
       ((SELECT TOP 1 id_producto FROM Productos WHERE nombre_producto='Camiseta Básica Premium'),'SKU-GE-CAM-003','L','Negro',59.90,30.00);

INSERT INTO Inventario (id_variante, id_almacen, cantidad_stock, stock_minimo, fecha_ultima_actualizacion)
VALUES ((SELECT TOP 1 id_variante FROM VariantesProducto WHERE codigo_sku='SKU-GE-CAM-001'),
        (SELECT TOP 1 id_almacen FROM Almacenes WHERE nombre_almacen='Almacén Central GE'),150,10,GETDATE()),
       ((SELECT TOP 1 id_variante FROM VariantesProducto WHERE codigo_sku='SKU-GE-CAM-002'),
        (SELECT TOP 1 id_almacen FROM Almacenes WHERE nombre_almacen='Almacén Central GE'),120,10,GETDATE()),
       ((SELECT TOP 1 id_variante FROM VariantesProducto WHERE codigo_sku='SKU-GE-CAM-003'),
        (SELECT TOP 1 id_almacen FROM Almacenes WHERE nombre_almacen='Almacén Secundario GE'),80,10,GETDATE());