# 🧹 Instrucciones para Limpiar Inventario Huérfano

## Problema Identificado
Existe inventario en la base de datos que apunta a variantes de productos que no existen. Esto causa error `EntityNotFoundException: Unable to find VarianteProducto with id 5002`.

## Solución Paso a Paso

### Opción 1: Limpiar automáticamente (RECOMENDADO)

1. **Recompila el backend** con los cambios realizados:
```powershell
cd backend
./mvnw clean compile
```

2. **Ejecuta el backend nuevamente**:
```powershell
./run-tapstyle.ps1
```

3. **Llama al nuevo endpoint de limpieza** desde tu navegador o Postman:
```
POST http://localhost:8083/api/inventario/limpiar/huerfanos
```

Ejemplo con curl:
```bash
curl -X POST http://localhost:8083/api/inventario/limpiar/huerfanos \
  -H "Content-Type: application/json"
```

Debería retornar algo como:
```json
{
  "success": true,
  "message": "Se eliminaron X registros huérfanos",
  "data": X
}
```

### Opción 2: Limpiar manualmente en SQL

Si prefieres ejecutar la limpieza directamente en tu BD:

```sql
-- Ver registros huérfanos
SELECT i.id_inventario, i.id_variante 
FROM inventario i
LEFT JOIN variantesproducto vp ON i.id_variante = vp.id_variante
WHERE vp.id_variante IS NULL;

-- Eliminar registros huérfanos
DELETE FROM inventario 
WHERE id_variante NOT IN (SELECT id_variante FROM variantesproducto);
```

## Verificación

Después de limpiar, ejecuta esto para verificar:

```
GET http://localhost:8083/api/inventario/empresa/122
```

Ahora debería traer todos los inventarios válidos sin errores. ✅

## Próximos Pasos

Una vez limpiados los datos huérfanos:

1. Recarga la página del módulo de Stock en el frontend
2. Los 3 productos nuevos (Casaca, Medias, Gorra) deberían aparecer
3. Prueba el botón "Ajustar Stock" para cada producto
