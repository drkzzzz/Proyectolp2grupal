# 📋 Ejemplos de Uso - TapStyle Backend API

## 🚀 Guía para Testear los Endpoints

A continuación se presentan ejemplos completos usando `curl` para probar todos los endpoints del backend.

---

## 1️⃣ Autenticación (`/api/auth`)

### Registrar un nuevo usuario
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Juan",
    "apellidos": "Pérez",
    "username": "juanperez",
    "email": "juan@example.com",
    "idRol": 1,
    "idEmpresa": 1
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanperez",
    "contraseña": "micontraseña123"
  }'
```

### Obtener datos del usuario actual
```bash
curl http://localhost:8080/api/auth/me/juanperez
```

---

## 2️⃣ Empresas (`/api/empresas`)

### Obtener todas las empresas
```bash
curl http://localhost:8080/api/empresas
```

### Obtener empresa por ID
```bash
curl http://localhost:8080/api/empresas/1
```

### Crear una nueva empresa
```bash
curl -X POST http://localhost:8080/api/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "nombreTienda": "Tienda de Zapatos Premium",
    "rucEmpresa": "20123456789",
    "direccionLegal": "Avenida Principal 456, Lima",
    "telefono": "+51-1-2345678",
    "emailContacto": "info@tiendapremium.com",
    "estadoAprobacion": "Aprobada",
    "tasaComision": 0.10
  }'
```

### Actualizar empresa
```bash
curl -X PUT http://localhost:8080/api/empresas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombreTienda": "Tienda Actualizada",
    "rucEmpresa": "20123456789",
    "direccionLegal": "Nueva Dirección 789",
    "telefono": "+51-1-9999999",
    "emailContacto": "nuevoemail@tienda.com",
    "estadoAprobacion": "Aprobada",
    "tasaComision": 0.12
  }'
```

### Eliminar empresa
```bash
curl -X DELETE http://localhost:8080/api/empresas/1
```

---

## 3️⃣ Usuarios (`/api/usuarios`)

### Obtener todos los usuarios
```bash
curl http://localhost:8080/api/usuarios
```

### Obtener usuario por ID
```bash
curl http://localhost:8080/api/usuarios/1
```

### Obtener usuario por username
```bash
curl http://localhost:8080/api/usuarios/username/juanperez
```

### Crear usuario
```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "idEmpresa": 1,
    "idRol": 2,
    "nombres": "Carlos",
    "apellidos": "García",
    "username": "carlosgarcia",
    "email": "carlos@example.com",
    "numeroDocumento": "12345678",
    "celular": "+51999999999",
    "direccion": "Calle 123, Apto 4"
  }'
```

### Actualizar usuario
```bash
curl -X PUT http://localhost:8080/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "idEmpresa": 1,
    "idRol": 2,
    "nombres": "Carlos Actualizado",
    "apellidos": "García",
    "email": "carlos.nuevo@example.com",
    "numeroDocumento": "12345678",
    "celular": "+51999888888",
    "direccion": "Nueva Calle 456"
  }'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:8080/api/usuarios/1
```

---

## 4️⃣ Productos (`/api/productos`)

### Obtener todos los productos
```bash
curl http://localhost:8080/api/productos
```

### Obtener producto por ID
```bash
curl http://localhost:8080/api/productos/1
```

### Obtener productos por empresa
```bash
curl http://localhost:8080/api/productos/empresa/1
```

### Crear producto
```bash
curl -X POST http://localhost:8080/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "idEmpresa": 1,
    "nombreProducto": "Zapato Deportivo Premium",
    "descripcion": "Zapato deportivo de alta calidad con suela de goma",
    "idCategoria": 1,
    "idProveedor": 1,
    "idUnidadMedida": 1,
    "dimensiones": "25x10x15",
    "pesoGramos": 350,
    "idMarca": 1,
    "idModelo": 1,
    "idMaterial": 1
  }'
```

### Actualizar producto
```bash
curl -X PUT http://localhost:8080/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "idEmpresa": 1,
    "nombreProducto": "Zapato Deportivo Premium V2",
    "descripcion": "Versión mejorada del zapato deportivo",
    "idCategoria": 1,
    "idProveedor": 1,
    "idUnidadMedida": 1,
    "dimensiones": "25x10x15",
    "pesoGramos": 340
  }'
```

### Eliminar producto
```bash
curl -X DELETE http://localhost:8080/api/productos/1
```

---

## 5️⃣ Inventario (`/api/inventario`)

### Obtener todo el inventario
```bash
curl http://localhost:8080/api/inventario
```

### Obtener inventario por almacén
```bash
curl http://localhost:8080/api/inventario/almacen/1
```

### Obtener productos con bajo stock
```bash
curl http://localhost:8080/api/inventario/bajo-stock
```

### Crear registro de inventario
```bash
curl -X POST http://localhost:8080/api/inventario \
  -H "Content-Type: application/json" \
  -d '{
    "idVariante": 1,
    "idAlmacen": 1,
    "cantidadStock": 100,
    "stockMinimo": 10
  }'
```

### Actualizar stock
```bash
curl -X PUT http://localhost:8080/api/inventario/1 \
  -H "Content-Type: application/json" \
  -d '{
    "idVariante": 1,
    "idAlmacen": 1,
    "cantidadStock": 150,
    "stockMinimo": 10
  }'
```

### Ajustar stock (entrada)
```bash
curl -X POST http://localhost:8080/api/inventario/1/ajustar \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 50,
    "tipo": "entrada"
  }' \
  -G -d "cantidad=50&tipo=entrada"
```

### Ajustar stock (salida)
```bash
curl -X POST 'http://localhost:8080/api/inventario/1/ajustar?cantidad=20&tipo=salida'
```

### Eliminar registro de inventario
```bash
curl -X DELETE http://localhost:8080/api/inventario/1
```

---

## 6️⃣ Clientes (`/api/clientes`)

### Obtener todos los clientes
```bash
curl http://localhost:8080/api/clientes
```

### Obtener cliente por ID
```bash
curl http://localhost:8080/api/clientes/1
```

### Crear cliente
```bash
curl -X POST http://localhost:8080/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "idUsuario": 2,
    "nombre": "María",
    "apellido": "López",
    "numeroDocumento": "87654321",
    "direccion": "Avenida Central 789",
    "telefono": "+51987654321",
    "email": "maria@example.com",
    "estado": true
  }'
```

### Actualizar cliente
```bash
curl -X PUT http://localhost:8080/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María Actualizado",
    "apellido": "López",
    "numeroDocumento": "87654321",
    "direccion": "Avenida Actualizada 999",
    "telefono": "+51987654999",
    "email": "maria.nuevo@example.com",
    "estado": true
  }'
```

### Eliminar cliente
```bash
curl -X DELETE http://localhost:8080/api/clientes/1
```

---

## 7️⃣ Proveedores (`/api/proveedores`)

### Obtener todos los proveedores
```bash
curl http://localhost:8080/api/proveedores
```

### Obtener proveedor por ID
```bash
curl http://localhost:8080/api/proveedores/1
```

### Obtener proveedores por empresa
```bash
curl http://localhost:8080/api/proveedores/empresa/1
```

### Crear proveedor
```bash
curl -X POST http://localhost:8080/api/proveedores \
  -H "Content-Type: application/json" \
  -d '{
    "idEmpresa": 1,
    "razonSocial": "Distribuidora de Calzado S.A.",
    "nombreComercial": "CalzadoMax",
    "ruc": "20987654321",
    "rubro": "Distribución de Calzado",
    "direccion": "Industrial 123, Lima",
    "telefono": "+51-1-5551234",
    "email": "proveedores@calzadomax.com"
  }'
```

### Actualizar proveedor
```bash
curl -X PUT http://localhost:8080/api/proveedores/1 \
  -H "Content-Type: application/json" \
  -d '{
    "razonSocial": "Distribuidora de Calzado Actualizada",
    "nombreComercial": "CalzadoMax Pro",
    "ruc": "20987654321",
    "rubro": "Distribución Premium",
    "direccion": "Industrial 456, Lima",
    "telefono": "+51-1-5555555",
    "email": "nuevoproveedor@calzadomax.com"
  }'
```

### Eliminar proveedor
```bash
curl -X DELETE http://localhost:8080/api/proveedores/1
```

---

## 📊 Estructura de Response

### ✅ Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación realizada exitosamente",
  "data": {
    "id": 1,
    "nombre": "Ejemplo"
  },
  "error": null
}
```

### ❌ Respuesta con Error
```json
{
  "success": false,
  "message": "No se pudo completar la operación",
  "data": null,
  "error": "Detalle del error aquí"
}
```

---

## 🔍 Códigos HTTP

| Código | Significado |
|--------|-------------|
| **200** | OK - Operación exitosa |
| **201** | Created - Recurso creado |
| **204** | No Content - Eliminado exitosamente |
| **400** | Bad Request - Datos inválidos |
| **401** | Unauthorized - Sin autenticación |
| **404** | Not Found - Recurso no encontrado |
| **500** | Internal Server Error - Error del servidor |

---

## 💡 Tips para Testing

1. **Usar Postman**: Para mayor facilidad, importa estos ejemplos en Postman
2. **Variables de entorno**: Define `{{base_url}}` = `http://localhost:8080/api`
3. **Headers comunes**:
   ```
   Content-Type: application/json
   Accept: application/json
   ```
4. **JWT Token**: Cuando se implemente, agrega:
   ```
   Authorization: Bearer {{token}}
   ```

---

## 📞 Validación de Datos

Antes de enviar datos, asegúrate de:

- ✅ **Emails válidos**: user@example.com
- ✅ **Usernames únicos**: Sin caracteres especiales
- ✅ **RUC válido**: Formato de 11 dígitos
- ✅ **IDs existentes**: FK deben referenciar registros existentes
- ✅ **Stock no negativo**: Cantidad >= 0

---

**Generado:** Noviembre 2024
