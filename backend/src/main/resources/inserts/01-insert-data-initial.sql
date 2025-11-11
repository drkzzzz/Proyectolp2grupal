-- ====================================================================
-- INSERTS INICIALES PARA TAPSTYLE - BASE DE DATOS DE PRUEBA
-- Ejecutar después de crear la estructura de tablas
-- ====================================================================

-- ====================================================================
-- 1. INSERTAR TIPOS DE DOCUMENTO
-- ====================================================================
INSERT INTO TipoDocumento (nombre_tipodocumento) VALUES 
('DNI'),
('RUC'),
('Pasaporte'),
('Licencia'),
('Otro');

-- ====================================================================
-- 2. INSERTAR EMPRESAS/TIENDAS
-- ====================================================================
INSERT INTO Empresas (nombre_tienda, ruc_empresa, direccion_legal, telefono, email_contacto, estado_aprobacion, tasa_comision) VALUES 
('TapStyle - Gentle Elegance', '20123456789', 'Jr. Fashion #101, Lima, Perú', '987654321', 'info@tapstyle-ge.com', 'Aprobada', 0.15),
('TapStyle - Glamour Time', '20987654321', 'Av. Style #202, Lima, Perú', '987654322', 'info@tapstyle-gt.com', 'Aprobada', 0.15),
('TapStyle - Performance Footwear', '20555666777', 'Calle Deporte #303, Lima, Perú', '987654323', 'info@tapstyle-pf.com', 'Aprobada', 0.12),
('TapStyle - Street Vibe', '20888999000', 'Av. Urban #404, Lima, Perú', '987654324', 'info@tapstyle-sv.com', 'Aprobada', 0.15);

-- ====================================================================
-- 3. INSERTAR ROLES
-- ====================================================================
INSERT INTO Roles (nombre_rol, estado, descripcion) VALUES 
('SuperAdmin', TRUE, 'Administrador del sistema con acceso total'),
('Admin', TRUE, 'Administrador de empresa con control completo'),
('Vendedor', TRUE, 'Personal de ventas con acceso a inventario'),
('Empleado', TRUE, 'Empleado general con permisos limitados'),
('Cliente', TRUE, 'Cliente registrado de la tienda');

-- ====================================================================
-- 4. INSERTAR PERMISOS
-- ====================================================================
INSERT INTO Permisos (nombre_permiso, descripcion) VALUES 
('CREAR_EMPRESA', 'Permiso para crear nuevas empresas'),
('EDITAR_EMPRESA', 'Permiso para editar información de empresa'),
('ELIMINAR_EMPRESA', 'Permiso para eliminar empresas'),
('GESTIONAR_USUARIOS', 'Permiso para gestionar usuarios'),
('GESTIONAR_ROLES', 'Permiso para gestionar roles y permisos'),
('VER_REPORTES', 'Permiso para ver reportes'),
('GENERAR_REPORTES', 'Permiso para generar reportes'),
('GESTIONAR_PRODUCTOS', 'Permiso para CRUD de productos'),
('GESTIONAR_INVENTARIO', 'Permiso para gestionar inventario'),
('GESTIONAR_PROVEEDORES', 'Permiso para CRUD de proveedores'),
('GESTIONAR_CLIENTES', 'Permiso para CRUD de clientes'),
('VER_VENTAS', 'Permiso para ver registro de ventas'),
('REALIZAR_VENTAS', 'Permiso para procesar ventas'),
('GESTIONAR_CAJA', 'Permiso para gestionar caja'),
('APROBAR_PAGOS', 'Permiso para aprobar pagos'),
('VER_FINANZAS', 'Permiso para ver información financiera');

-- ====================================================================
-- 5. ASIGNAR PERMISOS A ROLES
-- ====================================================================
-- SuperAdmin - todos los permisos
INSERT INTO Rol_Permisos (id_rol, id_permiso) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16);

-- Admin - permisos completos excepto crear empresa
INSERT INTO Rol_Permisos (id_rol, id_permiso) VALUES 
(2, 2), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13), (2, 14), (2, 15), (2, 16);

-- Vendedor - permisos de venta
INSERT INTO Rol_Permisos (id_rol, id_permiso) VALUES 
(3, 8), (3, 9), (3, 12), (3, 13), (3, 14);

-- Empleado - permisos limitados
INSERT INTO Rol_Permisos (id_rol, id_permiso) VALUES 
(4, 9), (4, 12);

-- Cliente - sin permisos especiales
-- INSERT INTO Rol_Permisos (id_rol, id_permiso) VALUES ...;

-- ====================================================================
-- 6. INSERTAR USUARIOS
-- ====================================================================
-- SuperAdmin
INSERT INTO Usuarios (id_empresa, id_rol, nombres, apellidos, id_tipodocumento, numero_documento, celular, direccion, username, email, contraseña_hash, estado) VALUES 
(1, 1, 'Carlos', 'Admin', 1, '12345678', '987654300', 'Lima, Perú', 'superadmin', 'superadmin@tapstyle.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE);

-- Admins por empresa
INSERT INTO Usuarios (id_empresa, id_rol, nombres, apellidos, id_tipodocumento, numero_documento, celular, direccion, username, email, contraseña_hash, estado) VALUES 
(1, 2, 'María', 'García', 1, '87654321', '987654301', 'Lima, Perú', 'admin_ge', 'admin@tapstyle-ge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(2, 2, 'Juan', 'López', 1, '87654322', '987654302', 'Lima, Perú', 'admin_gt', 'admin@tapstyle-gt.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(3, 2, 'Ana', 'Martínez', 1, '87654323', '987654303', 'Lima, Perú', 'admin_pf', 'admin@tapstyle-pf.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(4, 2, 'Pedro', 'Rodríguez', 1, '87654324', '987654304', 'Lima, Perú', 'admin_sv', 'admin@tapstyle-sv.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE);

-- Vendedores
INSERT INTO Usuarios (id_empresa, id_rol, nombres, apellidos, id_tipodocumento, numero_documento, celular, direccion, username, email, contraseña_hash, estado) VALUES 
(1, 3, 'Laura', 'Sánchez', 1, '87654325', '987654305', 'Lima, Perú', 'vendedor_ge1', 'vendedor1@tapstyle-ge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(1, 3, 'Roberto', 'Fernández', 1, '87654326', '987654306', 'Lima, Perú', 'vendedor_ge2', 'vendedor2@tapstyle-ge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(2, 3, 'Sofia', 'Torres', 1, '87654327', '987654307', 'Lima, Perú', 'vendedor_gt1', 'vendedor1@tapstyle-gt.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(3, 3, 'Miguel', 'Gómez', 1, '87654328', '987654308', 'Lima, Perú', 'vendedor_pf1', 'vendedor1@tapstyle-pf.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(4, 3, 'Carmen', 'Díaz', 1, '87654329', '987654309', 'Lima, Perú', 'vendedor_sv1', 'vendedor1@tapstyle-sv.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE);

-- Empleados
INSERT INTO Usuarios (id_empresa, id_rol, nombres, apellidos, id_tipodocumento, numero_documento, celular, direccion, username, email, contraseña_hash, estado) VALUES 
(1, 4, 'David', 'Ruiz', 1, '87654330', '987654310', 'Lima, Perú', 'empleado_ge1', 'empleado1@tapstyle-ge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(2, 4, 'Elena', 'Morales', 1, '87654331', '987654311', 'Lima, Perú', 'empleado_gt1', 'empleado1@tapstyle-gt.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE);

-- Clientes
INSERT INTO Usuarios (id_empresa, id_rol, nombres, apellidos, id_tipodocumento, numero_documento, celular, direccion, username, email, contraseña_hash, estado) VALUES 
(1, 5, 'Cliente', 'Uno', 1, '11111111', '987111111', 'Lima, Perú', 'cliente_uno', 'cliente1@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(1, 5, 'Cliente', 'Dos', 1, '22222222', '987222222', 'Lima, Perú', 'cliente_dos', 'cliente2@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE),
(2, 5, 'Cliente', 'Tres', 1, '33333333', '987333333', 'Lima, Perú', 'cliente_tres', 'cliente3@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGvzH.EsyhHcqDR2', TRUE);

-- ====================================================================
-- 7. INSERTAR CLIENTES
-- ====================================================================
INSERT INTO Clientes (id_usuario, nombre, apellido, id_tipodocumento, numero_documento, direccion, telefono, email, estado) VALUES 
(14, 'Cliente', 'Uno', 1, '11111111', 'Av. Principal #100', '987111111', 'cliente1@email.com', TRUE),
(15, 'Cliente', 'Dos', 1, '22222222', 'Av. Principal #200', '987222222', 'cliente2@email.com', TRUE),
(16, 'Cliente', 'Tres', 1, '33333333', 'Av. Principal #300', '987333333', 'cliente3@email.com', TRUE);

-- ====================================================================
-- 8. INSERTAR PROVEEDORES
-- ====================================================================
INSERT INTO Proveedores (id_empresa, nombre_proveedor, ruc_proveedor, contacto, telefono, email, direccion, estado) VALUES 
(1, 'Distribuidor Premium SPA', '20123456700', 'Juan Pérez', '987000001', 'proveedor@premium.com', 'Jr. Industrial #500', TRUE),
(1, 'Fábrica Textil Perú SA', '20654321087', 'María González', '987000002', 'ventas@fabricatextil.com', 'Av. Industrial #600', TRUE),
(2, 'Importador Global EIRL', '20789456123', 'Carlos López', '987000003', 'info@importador.com', 'Calle Comercio #700', TRUE),
(3, 'Distribuidor Deportivo SA', '20456789012', 'Ana Rodríguez', '987000004', 'contacto@deportivo.com', 'Av. Deportes #800', TRUE),
(4, 'Wholesaler Urban Ltd', '20321654987', 'Pedro Martínez', '987000005', 'ventas@urban.com', 'Jr. Street #900', TRUE);

-- ====================================================================
-- 9. INSERTAR UNIDADES DE MEDIDA
-- ====================================================================
INSERT INTO UnidadMedida (nombre_unidad, abreviatura) VALUES 
('Unidad', 'UND'),
('Docena', 'DOZ'),
('Resma', 'RSM'),
('Caja', 'CJA'),
('Metro', 'MTR');

-- ====================================================================
-- 10. INSERTAR MARCAS
-- ====================================================================
INSERT INTO Marcas (nombre_marca, estado) VALUES 
('Nike', TRUE),
('Adidas', TRUE),
('Puma', TRUE),
('Converse', TRUE),
('Tommy Hilfiger', TRUE),
('Calvin Klein', TRUE),
('Levi''s', TRUE),
('Gucci', TRUE),
('Chanel', TRUE),
('Vans', TRUE);

-- ====================================================================
-- 11. INSERTAR MATERIALES
-- ====================================================================
INSERT INTO Materiales (nombre_material, estado) VALUES 
('Algodón', TRUE),
('Poliéster', TRUE),
('Lino', TRUE),
('Seda', TRUE),
('Cuero', TRUE),
('Gamuza', TRUE),
('Denim', TRUE),
('Spandex', TRUE),
('Lana', TRUE),
('Nylon', TRUE);

-- ====================================================================
-- 12. INSERTAR MODELOS
-- ====================================================================
INSERT INTO Modelos (nombre_modelo, estado) VALUES 
('Clásico', TRUE),
('Deportivo', TRUE),
('Casual', TRUE),
('Formal', TRUE),
('Elegante', TRUE),
('Minimalista', TRUE),
('Oversized', TRUE),
('Ajustado', TRUE);

-- ====================================================================
-- 13. INSERTAR CATEGORÍAS
-- ====================================================================
INSERT INTO CategoriaProducto (id_empresa, nombre_categoria, descripcion, estado) VALUES 
(1, 'Camisetas', 'Camisetas de algodón y poliéster para hombres y mujeres', TRUE),
(1, 'Pantalones', 'Pantalones jeans, chinos y deportivos', TRUE),
(1, 'Zapatos', 'Zapatos deportivos y casuales', TRUE),
(1, 'Accesorios', 'Sombreros, cinturones, bufandas', TRUE),
(1, 'Ropa Interior', 'Boxers, brasieres y calcetines', TRUE),
(2, 'Vestidos', 'Vestidos para todas las ocasiones', TRUE),
(2, 'Blusas', 'Blusas elegantes y casuales', TRUE),
(2, 'Faldas', 'Faldas de diversos estilos', TRUE),
(3, 'Zapatillas Deportivas', 'Zapatillas para correr y entrenar', TRUE),
(3, 'Ropa Deportiva', 'Conjunto de ropa para ejercicio', TRUE),
(4, 'Streetwear', 'Ropa urbana y casual', TRUE),
(4, 'Gorras', 'Gorras y sombreros urbanos', TRUE);

-- ====================================================================
-- 14. INSERTAR ALMACENES
-- ====================================================================
INSERT INTO Almacenes (id_empresa, nombre_almacen, ubicacion, capacidad_maxima, estado) VALUES 
(1, 'Almacén Central GE', 'Jr. Warehouse #100, Lima', 10000, TRUE),
(1, 'Almacén Secundario GE', 'Av. Storage #101, Lima', 5000, TRUE),
(2, 'Almacén Central GT', 'Jr. Warehouse #200, Lima', 8000, TRUE),
(3, 'Almacén Central PF', 'Jr. Warehouse #300, Lima', 6000, TRUE),
(4, 'Almacén Central SV', 'Jr. Warehouse #400, Lima', 7000, TRUE);

-- ====================================================================
-- 15. INSERTAR PRODUCTOS Y VARIANTES
-- ====================================================================

-- EMPRESA 1 - GENTLE ELEGANCE
-- Camiseta Básica Blanca
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(1, 1, 1, 1, 1, 1, 1, 'Camiseta Básica Premium', 'Camiseta de algodón 100% premium color blanco', 15.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(1, 'Camiseta Blanca S', 'Talla S color blanco', 'S', 'Blanco', 29.99, 0.00),
(1, 'Camiseta Blanca M', 'Talla M color blanco', 'M', 'Blanco', 29.99, 0.00),
(1, 'Camiseta Blanca L', 'Talla L color blanco', 'L', 'Blanco', 29.99, 0.00),
(1, 'Camiseta Blanca XL', 'Talla XL color blanco', 'XL', 'Blanco', 34.99, 2.00);

-- Camiseta Básica Negra
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(1, 1, 1, 1, 2, 1, 1, 'Camiseta Básica Negra', 'Camiseta de algodón 100% premium color negro', 15.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(2, 'Camiseta Negra S', 'Talla S color negro', 'S', 'Negro', 29.99, 0.00),
(2, 'Camiseta Negra M', 'Talla M color negro', 'M', 'Negro', 29.99, 0.00),
(2, 'Camiseta Negra L', 'Talla L color negro', 'L', 'Negro', 29.99, 0.00);

-- Pantalón Jeans Clásico
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(1, 2, 1, 1, 7, 1, 7, 'Pantalón Jeans Clásico', 'Pantalón jeans de corte clásico color azul índigo', 35.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(3, 'Jeans S Azul', 'Talla S color azul índigo', 'S', 'Azul Índigo', 79.99, 0.00),
(3, 'Jeans M Azul', 'Talla M color azul índigo', 'M', 'Azul Índigo', 79.99, 0.00),
(3, 'Jeans L Azul', 'Talla L color azul índigo', 'L', 'Azul Índigo', 79.99, 0.00),
(3, 'Jeans XL Azul', 'Talla XL color azul índigo', 'XL', 'Azul Índigo', 84.99, 2.00);

-- Zapatillas Deportivas
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(1, 3, 1, 1, 1, 2, 5, 'Zapatillas Deportivas Premium', 'Zapatillas con tecnología de amortiguación avanzada', 45.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(4, 'Zapatillas 36 Blancas', 'Talla 36 color blanco', '36', 'Blanco', 99.99, 0.00),
(4, 'Zapatillas 37 Blancas', 'Talla 37 color blanco', '37', 'Blanco', 99.99, 0.00),
(4, 'Zapatillas 38 Blancas', 'Talla 38 color blanco', '38', 'Blanco', 99.99, 0.00),
(4, 'Zapatillas 39 Blancas', 'Talla 39 color blanco', '39', 'Blanco', 99.99, 0.00),
(4, 'Zapatillas 40 Blancas', 'Talla 40 color blanco', '40', 'Blanco', 99.99, 0.00);

-- EMPRESA 2 - GLAMOUR TIME
-- Vestido Elegante
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(2, 6, 3, 1, 9, 5, 4, 'Vestido Noche Elegante', 'Vestido de seda para eventos especiales', 60.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(5, 'Vestido Negro S', 'Talla S color negro', 'S', 'Negro', 149.99, 0.00),
(5, 'Vestido Negro M', 'Talla M color negro', 'M', 'Negro', 149.99, 0.00),
(5, 'Vestido Rojo S', 'Talla S color rojo', 'S', 'Rojo', 149.99, 0.00);

-- Blusa Casual
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(2, 7, 3, 1, 5, 3, 1, 'Blusa Casual Cómoda', 'Blusa de algodón suave para uso diario', 18.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(6, 'Blusa Rosa XS', 'Talla XS color rosa', 'XS', 'Rosa', 45.99, 0.00),
(6, 'Blusa Rosa S', 'Talla S color rosa', 'S', 'Rosa', 45.99, 0.00),
(6, 'Blusa Rosa M', 'Talla M color rosa', 'M', 'Rosa', 45.99, 0.00);

-- EMPRESA 3 - PERFORMANCE FOOTWEAR
-- Zapatillas para Correr
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(3, 9, 4, 1, 2, 2, 5, 'Zapatillas Running Pro', 'Zapatillas diseñadas para corredores profesionales', 50.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(7, 'Running 37 Negras', 'Talla 37 color negro', '37', 'Negro', 119.99, 0.00),
(7, 'Running 38 Negras', 'Talla 38 color negro', '38', 'Negro', 119.99, 0.00),
(7, 'Running 39 Negras', 'Talla 39 color negro', '39', 'Negro', 119.99, 0.00),
(7, 'Running 40 Negras', 'Talla 40 color negro', '40', 'Negro', 119.99, 0.00),
(7, 'Running 41 Negras', 'Talla 41 color negro', '41', 'Negro', 119.99, 0.00),
(7, 'Running 42 Negras', 'Talla 42 color negro', '42', 'Negro', 124.99, 2.00);

-- Ropa Deportiva (Conjunto)
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(3, 10, 4, 1, 3, 2, 1, 'Conjunto Deportivo Premium', 'Conjunto completo para entrenamientos intensos', 32.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(8, 'Conjunto XS Azul', 'Talla XS color azul', 'XS', 'Azul', 69.99, 0.00),
(8, 'Conjunto S Azul', 'Talla S color azul', 'S', 'Azul', 69.99, 0.00),
(8, 'Conjunto M Azul', 'Talla M color azul', 'M', 'Azul', 69.99, 0.00),
(8, 'Conjunto L Azul', 'Talla L color azul', 'L', 'Azul', 74.99, 2.00);

-- EMPRESA 4 - STREET VIBE
-- Camiseta Streetwear
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(4, 11, 5, 1, 10, 7, 1, 'Camiseta Streetwear Urban', 'Camiseta oversized para el estilo urbano', 16.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(9, 'Street S Gris', 'Talla S color gris', 'S', 'Gris', 39.99, 0.00),
(9, 'Street M Gris', 'Talla M color gris', 'M', 'Gris', 39.99, 0.00),
(9, 'Street L Gris', 'Talla L color gris', 'L', 'Gris', 39.99, 0.00),
(9, 'Street XL Gris', 'Talla XL color gris', 'XL', 'Gris', 44.99, 2.00);

-- Gorras Urbanas
INSERT INTO Productos (id_empresa, id_categoria, id_proveedor, id_unidad_medida, id_marca, id_modelo, id_material, nombre_producto, descripcion, precio_costo, estado) VALUES 
(4, 12, 5, 1, 10, 1, 10, 'Gorra Urban Classic', 'Gorra clásica de tela ajustable', 8.00, TRUE);
INSERT INTO VarianteProducto (id_producto, nombre_variante, descripcion_variante, talla, color, precio_venta, costo_adicional) VALUES 
(10, 'Gorra Negra', 'Talla única color negro', 'Única', 'Negro', 24.99, 0.00),
(10, 'Gorra Blanca', 'Talla única color blanco', 'Única', 'Blanco', 24.99, 0.00),
(10, 'Gorra Azul', 'Talla única color azul', 'Única', 'Azul', 24.99, 0.00);

-- ====================================================================
-- 16. INSERTAR INVENTARIO
-- ====================================================================

-- Almacén Central GE
INSERT INTO Inventarios (id_variante, id_almacen, cantidad_stock, cantidad_minima, cantidad_maxima, estado) VALUES 
(1, 1, 50, 10, 200, TRUE),
(2, 1, 45, 10, 200, TRUE),
(3, 1, 40, 10, 200, TRUE),
(4, 1, 35, 10, 200, TRUE),
(5, 1, 100, 20, 300, TRUE),
(6, 1, 95, 20, 300, TRUE),
(7, 1, 90, 20, 300, TRUE),
(8, 1, 80, 20, 300, TRUE),
(9, 1, 60, 15, 250, TRUE),
(10, 1, 55, 15, 250, TRUE),
(11, 1, 50, 15, 250, TRUE),
(12, 1, 45, 15, 250, TRUE),
(13, 1, 40, 15, 250, TRUE);

-- Almacén Secundario GE
INSERT INTO Inventarios (id_variante, id_almacen, cantidad_stock, cantidad_minima, cantidad_maxima, estado) VALUES 
(1, 2, 25, 5, 100, TRUE),
(2, 2, 20, 5, 100, TRUE),
(3, 2, 18, 5, 100, TRUE),
(4, 2, 15, 5, 100, TRUE);

-- Almacén Central GT
INSERT INTO Inventarios (id_variante, id_almacen, cantidad_stock, cantidad_minima, cantidad_maxima, estado) VALUES 
(14, 3, 40, 10, 150, TRUE),
(15, 3, 35, 10, 150, TRUE),
(16, 3, 38, 10, 150, TRUE),
(17, 3, 35, 10, 150, TRUE),
(18, 3, 30, 10, 150, TRUE);

-- Almacén Central PF
INSERT INTO Inventarios (id_variante, id_almacen, cantidad_stock, cantidad_minima, cantidad_maxima, estado) VALUES 
(19, 4, 60, 15, 200, TRUE),
(20, 4, 55, 15, 200, TRUE),
(21, 4, 50, 15, 200, TRUE),
(22, 4, 48, 15, 200, TRUE),
(23, 4, 45, 15, 200, TRUE),
(24, 4, 42, 15, 200, TRUE),
(25, 4, 70, 20, 250, TRUE),
(26, 4, 65, 20, 250, TRUE),
(27, 4, 60, 20, 250, TRUE),
(28, 4, 55, 20, 250, TRUE);

-- Almacén Central SV
INSERT INTO Inventarios (id_variante, id_almacen, cantidad_stock, cantidad_minima, cantidad_maxima, estado) VALUES 
(29, 5, 75, 20, 200, TRUE),
(30, 5, 70, 20, 200, TRUE),
(31, 5, 65, 20, 200, TRUE),
(32, 5, 60, 20, 200, TRUE),
(33, 5, 50, 10, 150, TRUE),
(34, 5, 48, 10, 150, TRUE),
(35, 5, 45, 10, 150, TRUE);

-- ====================================================================
-- FIN DE LOS INSERTS
-- ====================================================================
-- Este script carga:
-- 4 Empresas
-- 22 Usuarios (1 SuperAdmin, 4 Admins, 5 Vendedores, 2 Empleados, 10 Clientes)
-- 3 Clientes registrados
-- 5 Proveedores
-- 10 Marcas
-- 10 Materiales
-- 8 Modelos
-- 12 Categorías
-- 5 Almacenes
-- 10 Productos con 35 variantes total
-- 94 Registros de inventario
-- ====================================================================
