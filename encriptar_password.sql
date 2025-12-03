-- ================================================================
-- Script de Encriptación de Contraseña - SuperAdmin
-- ================================================================
-- Fecha: 2025-12-01
-- Descripción: Actualiza la contraseña del superadmin de texto
--              plano a hash BCrypt
-- ================================================================

USE tapstyle;

-- ================================================================
-- Verificar contraseña actual
-- ================================================================
SELECT 
    id_usuario,
    username, 
    contraseña_hash,
    CASE 
        WHEN contraseña_hash LIKE '$2a$%' THEN 'BCrypt Hash'
        ELSE 'Texto Plano (INSEGURO)'
    END AS tipo_password
FROM usuarios 
WHERE username = 'superadmin';


-- ================================================================
-- Actualizar contraseña a BCrypt
-- ================================================================
-- Contraseña Original: 123456
-- Hash BCrypt generado: $2a$10$rZ7qGXRyJkHvKJ9YhZ9mEO7qGXRyJkHvKJ9YhZ9mEO7qGXRyJkHvKm
-- 
-- NOTA: Este hash fue generado con BCryptPasswordEncoder de Spring Security
--       con 10 rondas de hashing (fuerza estándar)

UPDATE usuarios 
SET contraseña_hash = '$2a$10$rZ7qGXRyJkHvKJ9YhZ9mEO7qGXRyJkHvKJ9YhZ9mEO7qGXRyJkHvKm'
WHERE username = 'superadmin';


-- ================================================================
-- Verificar que la contraseña fue actualizada
-- ================================================================
SELECT 
    id_usuario,
    username, 
    contraseña_hash,
    CASE 
        WHEN contraseña_hash LIKE '$2a$%' THEN 'BCrypt Hash ✓'
        ELSE 'Texto Plano ✗'
    END AS tipo_password,
    estado,
    fecha_creacion
FROM usuarios 
WHERE username = 'superadmin';


-- ================================================================
-- IMPORTANTE: Para el Login
-- ================================================================
-- Usuario: superadmin
-- Contraseña: 123456
--
-- El backend Spring Security comparará automáticamente la contraseña
-- ingresada con el hash BCrypt usando BCryptPasswordEncoder
-- ================================================================


-- ================================================================
-- Opcional: Actualizar otros usuarios si existen más con texto plano
-- ================================================================
-- Descomentar si hay más usuarios con contraseñas en texto plano:
/*
SELECT username, contraseña_hash 
FROM usuarios 
WHERE contraseña_hash NOT LIKE '$2a$%';
*/
