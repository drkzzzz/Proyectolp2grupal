-- Script para verificar y corregir datos de catálogo
-- Ejecutar en MySQL

-- 1. Verificar categorías existentes
SELECT * FROM categoriasproducto;

-- 2. Verificar unidades de medida
SELECT * FROM unidadesmedida;

-- 3. Si no hay categorías, insertar algunas básicas
INSERT IGNORE INTO categoriasproducto (nombre_categoria, descripcion)
VALUES 
    ('Camisetas', 'Camisetas y polos'),
    ('Pantalones', 'Pantalones y jeans'),
    ('Zapatos', 'Calzado deportivo y casual'),
    ('Accesorios', 'Accesorios de moda'),
    ('Ropa Deportiva', 'Ropa para deportes');

-- 4. Si no hay unidades de medida, insertar algunas básicas
INSERT IGNORE INTO unidadesmedida (nombre_unidad, abreviatura)
VALUES 
    ('Unidad', 'UND'),
    ('Docena', 'DOC'),
    ('Caja', 'CJA'),
    ('Par', 'PAR'),
    ('Metro', 'MTR');

-- 5. Verificar productos existentes y sus relaciones
SELECT 
    p.id_producto,
    p.nombre_producto,
    c.nombre_categoria,
    e.nombre_tienda
FROM productos p
LEFT JOIN categoriasproducto c ON p.id_categoria = c.id_categoria
LEFT JOIN empresas e ON p.id_empresa = e.id_empresa
LIMIT 10;

-- 6. Encontrar productos con categorías inválidas (si hay)
SELECT p.id_producto, p.nombre_producto, p.id_categoria
FROM productos p
LEFT JOIN categoriasproducto c ON p.id_categoria = c.id_categoria
WHERE c.id_categoria IS NULL;
