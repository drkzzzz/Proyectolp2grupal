-- ================================================================
-- Script de Limpieza de Tablas Duplicadas - TapStyle
-- ================================================================
-- Fecha: 2025-12-01
-- Descripción: Elimina tablas obsoletas con nombres diferentes
--              que quedaron de versiones anteriores del esquema
-- ================================================================

-- Verificar base de datos
USE tapstyle;

-- ================================================================
-- IMPORTANTE: Crear un backup antes de ejecutar
-- ================================================================
-- Ejecutar en consola antes de este script:
-- mysqldump -u root tapstyle > tapstyle_backup_antes_limpieza.sql


-- ================================================================
-- PASO 1: Desactivar verificaciones de claves foráneas temporalmente
-- ================================================================
-- Esto permite eliminar tablas que tienen relaciones
SET FOREIGN_KEY_CHECKS = 0;


-- ================================================================
-- PASO 2: Eliminar tablas duplicadas (versiones con guión bajo)
-- ================================================================

-- 1. Categorías de Producto (existe: categoriasproducto)
DROP TABLE IF EXISTS categorias_producto;

-- 2. Marcas de Producto (existe: marcasproducto)
DROP TABLE IF EXISTS marcas_producto;

-- 3. Materiales de Producto (existe: materialesproducto)
DROP TABLE IF EXISTS materiales_producto;

-- 4. Variantes de Producto (existe: variantesproducto)
DROP TABLE IF EXISTS variantes_producto;

-- 5. Unidades de Medida (existe: unidadesmedida)
DROP TABLE IF EXISTS unidades_medida;

-- 6. Tipo de Documento (existe: tipodocumento)
DROP TABLE IF EXISTS tipo_documento;


-- ================================================================
-- PASO 3: Reactivar verificaciones de claves foráneas
-- ================================================================
SET FOREIGN_KEY_CHECKS = 1;


-- ================================================================
-- PASO 4: Verificación - Listar tablas restantes
-- ================================================================
SHOW TABLES LIKE '%producto%';
SHOW TABLES LIKE '%unidad%';
SHOW TABLES LIKE '%documento%';


-- ================================================================
-- Resultado Esperado:
-- ================================================================
-- Deben aparecer solo las tablas SIN guión bajo:
-- - categoriasproducto
-- - marcasproducto
-- - materialesproducto
-- - variantesproducto
-- - unidadesmedida
-- - tipodocumento
-- 
-- NO deben aparecer:
-- - categorias_producto
-- - marcas_producto
-- - materiales_producto
-- - variantes_producto
-- - unidades_medida
-- - tipo_documento
-- ================================================================
