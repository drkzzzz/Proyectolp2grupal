-- ============================================
-- Script: Actualización de Permisos RBAC
-- Propósito: Crear permisos alineados con módulos del sistema
-- Fecha: 2025-12-09
-- ============================================

USE tapstyle;

-- ========================================
-- PASO 1: Limpiar permisos antiguos
-- ========================================

-- Eliminar asignaciones de permisos a roles
DELETE FROM rol_permisos;

-- Eliminar permisos antiguos que no están alineados con módulos
DELETE FROM permisos;

-- ========================================
-- PASO 2: Crear permisos por módulo
-- ========================================

-- Permisos para cada submódulo del sistema Admin Negocio
INSERT INTO permisos (nombre_permiso, descripcion) VALUES
('VER_DASHBOARD', 'Acceso al dashboard principal'),
('VER_PRODUCTOS', 'Ver y gestionar productos'),
('VER_CATEGORIAS', 'Ver y gestionar categorías de productos'),
('VER_MARCAS', 'Ver y gestionar marcas'),
('VER_COMPRAS', 'Ver y gestionar compras'),
('VER_VENTAS', 'Ver y gestionar ventas'),
('VER_STOCK', 'Ver y gestionar inventario/stock'),
('VER_PROVEEDORES', 'Ver y gestionar proveedores'),
('VER_METODOS_PAGO', 'Ver y gestionar métodos de pago'),
('VER_CAJA', 'Acceso al módulo de caja'),
('VER_FINANZAS', 'Ver finanzas y pagos'),
('VER_CLIENTES', 'Ver y gestionar clientes'),
('VER_ROLES', 'Ver y gestionar roles (SuperAdmin)'),
('VER_PERMISOS', 'Ver y gestionar permisos (SuperAdmin)'),
('VER_USUARIOS', 'Ver y gestionar usuarios');

-- ========================================
-- PASO 3: Asignar TODOS los permisos al rol Admin
-- ========================================

-- Verificar que el rol Admin existe (normalmente id_rol = 2)
-- Asignar todos los permisos al Admin
INSERT INTO rol_permisos (id_rol, id_permiso)
SELECT 2, id_permiso FROM permisos;

-- ========================================
-- PASO 4: Configurar rol Vendedor (ejemplo)
-- ========================================

-- Asignar permisos limitados al rol Vendedor (normalmente id_rol = 3)
-- Solo puede ver: Dashboard, Productos y Ventas
INSERT INTO rol_permisos (id_rol, id_permiso)
SELECT 3, id_permiso FROM permisos 
WHERE nombre_permiso IN ('VER_DASHBOARD', 'VER_PRODUCTOS', 'VER_VENTAS');

-- ========================================
-- PASO 5: Verificación
-- ========================================

-- Ver todos los permisos creados
SELECT * FROM permisos ORDER BY nombre_permiso;

-- Ver permisos del rol Admin
SELECT r.nombre_rol, p.nombre_permiso, p.descripcion
FROM roles r
INNER JOIN rol_permisos rp ON r.id_rol = rp.id_rol
INNER JOIN permisos p ON rp.id_permiso = p.id_permiso
WHERE r.id_rol = 2
ORDER BY p.nombre_permiso;

-- Ver permisos del rol Vendedor
SELECT r.nombre_rol, p.nombre_permiso, p.descripcion
FROM roles r
INNER JOIN rol_permisos rp ON r.id_rol = rp.id_rol
INNER JOIN permisos p ON rp.id_permiso = p.id_permiso
WHERE r.id_rol = 3
ORDER BY p.nombre_permiso;

-- ============================================
-- Resultado esperado:
-- - 15 permisos creados
-- - Rol Admin (id=2): 15 permisos asignados
-- - Rol Vendedor (id=3): 3 permisos asignados
-- ============================================
