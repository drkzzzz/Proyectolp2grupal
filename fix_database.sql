-- 1. Eliminar restricciones antiguas si existen (por si acaso)
-- Si esta línea da error porque no existe, ignórala y sigue con la siguiente
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = 'suscripcionesempresa' AND constraint_name = 'FK_Suscripciones_Planes');
SET @sql = IF(@fk_exists > 0, 'ALTER TABLE suscripcionesempresa DROP FOREIGN KEY FK_Suscripciones_Planes', 'SELECT "No FK to drop"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Corregir el tipo de dato de id_plan para que coincida con la tabla planes (BIGINT)
ALTER TABLE `suscripcionesempresa` MODIFY `id_plan` bigint(20) NOT NULL;

-- 3. Crear indice en la columna id_plan (necesario para la llave foránea)
-- Si ya existe el índice, esto podría dar un warning pero no error fatal
ALTER TABLE `suscripcionesempresa` ADD INDEX `IDX_Suscripciones_Planes` (`id_plan`);

-- 4. Crear la restricción correcta apuntando a la tabla 'planes'
ALTER TABLE `suscripcionesempresa` ADD CONSTRAINT `FK_Suscripciones_Planes` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`);
