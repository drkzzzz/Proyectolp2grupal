# ESPECIFICACIÓN DE ENDPOINTS API - MÓDULO CATÁLOGO

## PRODUCTOS

### GET /api/productos/empresa/{idEmpresa}
**Descripción**: Obtener todos los productos de una empresa
**Respuesta**: Array de ProductoDTO con stock

### GET /api/productos/{idProducto}
**Descripción**: Obtener un producto específico
**Respuesta**: ProductoDTO

### POST /api/productos
**Descripción**: Crear nuevo producto
**Body**:
```json
{
  "idEmpresa": 122,
  "nombreProducto": "Zapatilla Nike",
  "descripcion": "Zapatilla deportiva",
  "idCategoria": 1,
  "idMarca": 2,
  "idProveedor": 1,
  "pesoGramos": 350,
  "dimensiones": "10x20x30",
  "idMaterial": 1,
  "idUnidadMedida": 1
}
```

### PUT /api/productos/{idProducto}
**Descripción**: Actualizar producto existente
**Body**: Mismo que POST

### DELETE /api/productos/{idProducto}
**Descripción**: Eliminar producto

---

## CATEGORÍAS

### GET /api/categorias
**Descripción**: Obtener todas las categorías

### POST /api/categorias
**Descripción**: Crear nueva categoría
**Body**:
```json
{
  "nombreCategoria": "Camisetas",
  "descripcion": "Camisetas varias"
}
```

### PUT /api/categorias/{idCategoria}
**Descripción**: Actualizar categoría

### DELETE /api/categorias/{idCategoria}
**Descripción**: Eliminar categoría

---

## MARCAS

### GET /api/marcas/empresa/{idEmpresa}
**Descripción**: Obtener marcas de una empresa

### POST /api/marcas
**Descripción**: Crear nueva marca
**Body**:
```json
{
  "idEmpresa": 122,
  "nombreMarca": "Nike"
}
```

### PUT /api/marcas/{idMarca}
**Descripción**: Actualizar marca

### DELETE /api/marcas/{idMarca}
**Descripción**: Eliminar marca

---

## MATERIALES

### GET /api/materiales
**Descripción**: Obtener todos los materiales

### POST /api/materiales
**Descripción**: Crear nuevo material
**Body**:
```json
{
  "nombreMaterial": "Algodón"
}
```

---

## PROVEEDORES

### GET /api/proveedores/empresa/{idEmpresa}
**Descripción**: Obtener proveedores de una empresa

### POST /api/proveedores
**Descripción**: Crear nuevo proveedor
**Body**:
```json
{
  "idEmpresa": 122,
  "razonSocial": "Distribuidor ABC",
  "nombreComercial": "ABC Distribuidora",
  "ruc": "20123456789",
  "rubro": "Textil",
  "direccion": "Jr. Industrial #500",
  "telefono": "987000001",
  "email": "contacto@abc.com"
}
```

---

## INVENTARIO

### GET /api/inventario/empresa/{idEmpresa}
**Descripción**: Obtener stock de todos los productos

### PUT /api/inventario/{idProducto}
**Descripción**: Actualizar stock de un producto
**Body**:
```json
{
  "cantidadDisponible": 100,
  "cantidadReservada": 10
}
```
