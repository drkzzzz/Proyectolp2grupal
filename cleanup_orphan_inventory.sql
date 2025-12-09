-- Script para limpiar inventario huérfano (sin variantes asociadas)

-- Ver registros huérfanos
SELECT 
    i.id_inventario,
    i.id_variante,
    i.id_almacen,
    i.cantidad_stock
FROM inventario i
LEFT JOIN variantesproducto vp ON i.id_variante = vp.id_variante
WHERE vp.id_variante IS NULL;

-- Eliminar inventario huérfano
DELETE FROM inventario 
WHERE id_variante NOT IN (SELECT id_variante FROM variantesproducto);

-- Verificar que se eliminaron
SELECT COUNT(*) as registros_restantes FROM inventario;
SELECT COUNT(*) as variantes_totales FROM variantesproducto;
