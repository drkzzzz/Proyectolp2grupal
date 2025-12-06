-- PASO 1: Eliminar la restricción actual que está bloqueando los estados "Pagado" e "Inactiva".
-- Ejecuta esta línea primero. Si da error de sintaxis, prueba la alternativa comentada abajo.

ALTER TABLE suscripcionesempresa DROP CONSTRAINT CHK_EstadoSuscripcion;

-- ALTER TABLE suscripcionesempresa DROP CHECK CHK_EstadoSuscripcion; -- Alternativa para algunas versiones de MySQL


-- PASO 2: (Opcional) Volver a crear la restricción con los nuevos estados permitidos.
-- Si prefieres no tener restricción, no ejecutes esto.

ALTER TABLE suscripcionesempresa ADD CONSTRAINT CHK_EstadoSuscripcion 
CHECK (estado IN ('Pendiente', 'Activa', 'Vencida', 'Cancelada', 'Pagado', 'Inactiva'));
