-- Arreglar productos con referencias rotas
-- Producto 503: id_unidad_medida 50 no existe, cambiar a 1 (que existe)
UPDATE productos SET id_unidad_medida = 1 WHERE id_producto = 503 AND id_unidad_medida = 50;

-- Producto 504: id_unidad_medida 1 existe, pero revisar id_proveedor 50
-- Proveedor 50 existe para empresa 122, así que está bien

-- Verificar que no hay más referencias rotas
SELECT p.id_producto, p.nombre_producto, p.id_unidad_medida, p.id_categoria 
FROM productos p 
WHERE p.id_unidad_medida NOT IN (SELECT id_unidad_medida FROM unidadesmedida)
OR p.id_categoria NOT IN (SELECT id_categoria FROM categoriasproducto);
