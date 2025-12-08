-- V1__Create_TipoPago_Table.sql
CREATE TABLE IF NOT EXISTS tipo_pago (
    id_tipo_pago INT AUTO_INCREMENT PRIMARY KEY,
    tipo_pago VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default payment methods
INSERT INTO tipo_pago (tipo_pago, descripcion, activo) VALUES
('Efectivo', 'Pago en efectivo', TRUE),
('Tarjeta de Crédito', 'Pago con tarjeta de crédito', TRUE),
('Tarjeta de Débito', 'Pago con tarjeta de débito', TRUE),
('Transferencia Bancaria', 'Transferencia a cuenta bancaria', TRUE),
('Cheque', 'Pago con cheque', TRUE);
