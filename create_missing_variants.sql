-- Crear variantes faltantes para los productos que no las tienen
-- Productos SANTIS (empresa 122): 500, 501, 502, 503, 504

-- Verificar variantes existentes para producto 502 (Puma Suede Classic)
-- Si no existen, crearlas
INSERT INTO variantesproducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra) 
SELECT 502, 'PUMA-SC-40', '40', 'Blanco', 220.00, 110.00
WHERE NOT EXISTS (SELECT 1 FROM variantesproducto WHERE id_producto = 502);

-- Variantes para producto 503 (Polo nike)
INSERT INTO variantesproducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra)
SELECT 503, 'POLO-NIKE-S', 'S', 'Rojo', 0.00, 0.00
WHERE NOT EXISTS (SELECT 1 FROM variantesproducto WHERE id_producto = 503);

-- Variantes para producto 504 (Polo deportivo)
INSERT INTO variantesproducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra)
SELECT 504, 'POLO-DEP-M', 'M', 'Multicolor', 65.00, 30.00
WHERE NOT EXISTS (SELECT 1 FROM variantesproducto WHERE id_producto = 504);

-- Variante para producto 101 (Pantalón Chino Beige) - empresa 200
INSERT INTO variantesproducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra)
SELECT 101, 'PANT-CH-32', '32', 'Beige', 120.00, 60.00
WHERE NOT EXISTS (SELECT 1 FROM variantesproducto WHERE id_producto = 101);

-- Variante para producto 102 (Blusa Seda Negra) - empresa 200
INSERT INTO variantesproducto (id_producto, codigo_sku, talla, color, precio_venta, costo_compra)
SELECT 102, 'BLUSA-SED-S', 'S', 'Negro', 95.50, 50.00
WHERE NOT EXISTS (SELECT 1 FROM variantesproducto WHERE id_producto = 102);

-- Commit los cambios
COMMIT;
