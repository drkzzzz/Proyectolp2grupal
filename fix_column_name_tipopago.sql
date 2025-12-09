-- Renombrar columna id_tipopago a id_tipo_pago para coincidir con el Entity
ALTER TABLE tipo_pago CHANGE COLUMN id_tipopago id_tipo_pago INT AUTO_INCREMENT;
