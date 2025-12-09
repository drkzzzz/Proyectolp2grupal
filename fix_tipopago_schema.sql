-- Renombrar tabla para que coincida con la Entidad JPA (standard naming)
RENAME TABLE tipospago TO tipo_pago;

-- Agregar columna 'activo' si falta (para borrado lógico)
ALTER TABLE tipo_pago ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

-- Opcional: Si la tabla ya tenía datos, asegurarse que activo sea true
UPDATE tipo_pago SET activo = TRUE;

-- Insertar métodos básicos si está vacía
INSERT INTO tipo_pago (tipo_pago, activo)
SELECT 'Efectivo', 1 WHERE NOT EXISTS (SELECT 1 FROM tipo_pago WHERE tipo_pago = 'Efectivo');

INSERT INTO tipo_pago (tipo_pago, activo)
SELECT 'Tarjeta', 1 WHERE NOT EXISTS (SELECT 1 FROM tipo_pago WHERE tipo_pago = 'Tarjeta');

INSERT INTO tipo_pago (tipo_pago, activo)
SELECT 'Transferencia', 1 WHERE NOT EXISTS (SELECT 1 FROM tipo_pago WHERE tipo_pago = 'Transferencia');
