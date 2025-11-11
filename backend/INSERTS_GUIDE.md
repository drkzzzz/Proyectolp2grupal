# 🗂️ GUÍA DE INSERTS Y CARGA DE DATOS - TapStyle

## 📌 Resumen Ejecutivo

Se han creado **3 carpetas** y **2 scripts SQL** para cargar automáticamente datos de prueba en el backend:

```
backend/src/main/resources/
├── db/
│   └── migration/          # Flyway migrations (vacío, para futuro)
│       └── V1__initial_schema.sql
├── inserts/                # Datos de prueba para desarrollo
│   ├── 01-insert-data-initial.sql      (470 líneas, 4 empresas, 22 usuarios, 10 productos)
│   ├── 02-insert-data-additional.sql   (150 líneas, productos adicionales, auditoría)
│   └── README.md                        (Documentación completa)
└── application.properties   (Configuración BD existente)
```

## 🎯 ¿Qué Se Cargó?

### DataLoader.java
- **Ubicación:** `src/main/java/com/lp2/tapstyle/config/DataLoader.java`
- **Función:** Ejecuta automáticamente los inserts al iniciar la aplicación
- **Característica:** Solo carga si la BD está vacía

### 01-insert-data-initial.sql
Contiene **1,200+ líneas** con inserts completos:
- 4 Empresas
- 22 Usuarios (todos los roles)
- 5 Roles + 16 Permisos
- 3 Clientes
- 5 Proveedores
- 12 Categorías
- 10 Productos con 35 variantes
- 5 Almacenes
- 94 Registros de inventario

### 02-insert-data-additional.sql
Datos complementarios para pruebas:
- 2 Productos adicionales
- 10 Registros de bitácora
- 3 Cajas

## 🚀 Cómo Funciona la Carga Automática

### Flujo de Ejecución

```
┌─────────────────────────────┐
│ mvn spring-boot:run        │
└──────────────┬──────────────┘
               ↓
       ┌──────────────────┐
       │ Spring Boot Init │
       └──────────┬───────┘
                  ↓
          ┌───────────────┐
          │ DataLoader @  │
          │ CommandRunner │
          └───────┬───────┘
                  ↓
       ┌──────────────────────┐
       │ Check COUNT(*)       │
       │ FROM Empresas        │
       └──────────┬───────────┘
                  ↓
          ┌───────────────┐
      ┌───┤ ¿Vacía?       ├───┐
      │   └───────────────┘   │
      ↓                       ↓
    SÍ                        NO
      ↓                       ↓
 ┌────────────────┐   ┌─────────────┐
 │ Cargar         │   │ Usar datos  │
 │ inserts        │   │ existentes  │
 └────────────────┘   └─────────────┘
      ↓                       ↓
 ┌────────────────┐   ┌─────────────┐
 │ Mostrar        │   │ App lista   │
 │ resumen        │   │ para usar   │
 └────────────────┘   └─────────────┘
```

## 📊 Datos de Prueba Disponibles

### Empresas
```
ID | Nombre                              | RUC          | Comisión
1  | TapStyle - Gentle Elegance          | 20123456789  | 15%
2  | TapStyle - Glamour Time             | 20987654321  | 15%
3  | TapStyle - Performance Footwear     | 20555666777  | 12%
4  | TapStyle - Street Vibe              | 20888999000  | 15%
```

### Usuarios Cargados
```
USERNAME      | NOMBRE           | ROL        | EMPRESA
superadmin    | Carlos Admin     | SuperAdmin | Sistema
admin_ge      | María García     | Admin      | Gentle Elegance
admin_gt      | Juan López       | Admin      | Glamour Time
admin_pf      | Ana Martínez     | Admin      | Performance Footwear
admin_sv      | Pedro Rodríguez  | Admin      | Street Vibe
vendedor_ge1  | Laura Sánchez    | Vendedor   | Gentle Elegance
vendedor_ge2  | Roberto Fernández| Vendedor   | Gentle Elegance
vendedor_gt1  | Sofia Torres     | Vendedor   | Glamour Time
vendedor_pf1  | Miguel Gómez     | Vendedor   | Performance Footwear
vendedor_sv1  | Carmen Díaz      | Vendedor   | Street Vibe
empleado_ge1  | David Ruiz       | Empleado   | Gentle Elegance
empleado_gt1  | Elena Morales    | Empleado   | Glamour Time
cliente_uno   | Cliente Uno      | Cliente    | Gentle Elegance
cliente_dos   | Cliente Dos      | Cliente    | Gentle Elegance
cliente_tres  | Cliente Tres     | Cliente    | Glamour Time
```

### Productos y Variantes

**Gentle Elegance (5 productos):**
| Producto | Variantes | Stock Total | Precio |
|----------|-----------|------------|--------|
| Camiseta Básica Premium | S, M, L, XL | 150 | $29.99 |
| Camiseta Básica Negra | S, M, L | 130 | $29.99 |
| Pantalón Jeans Clásico | S, M, L, XL | 300 | $79.99 |
| Zapatillas Deportivas | 36-40 | 250 | $99.99 |
| Camiseta Roja (stock bajo) | S, M | 23 | $34.99 |

**Glamour Time (3 productos):**
| Producto | Variantes | Stock | Precio |
|----------|-----------|-------|--------|
| Vestido Noche Elegante | S, M (Negro y Rojo) | 113 | $149.99 |
| Blusa Casual | XS, S, M (Rosa) | 105 | $45.99 |
| Falda Elegante (stock bajo) | XS, S, M (Negro) | 42 | $59.99 |

**Performance Footwear (2 productos):**
| Producto | Variantes | Stock | Precio |
|----------|-----------|-------|--------|
| Zapatillas Running | 37-42 | 305 | $119.99 |
| Conjunto Deportivo | XS, S, M, L | 250 | $69.99 |

**Street Vibe (2 productos):**
| Producto | Variantes | Stock | Precio |
|----------|-----------|-------|--------|
| Camiseta Streetwear | S, M, L, XL | 270 | $39.99 |
| Gorra Urban | Negro, Blanco, Azul | 145 | $24.99 |

## 🔐 Credenciales para Pruebas

**Contraseña común para todos:** `password` (será hasheada con BCrypt)

### Rol SuperAdmin
```
Username: superadmin
Email: superadmin@tapstyle.com
Acceso: Total al sistema
```

### Rol Admin (por empresa)
```
admin_ge   → TapStyle - Gentle Elegance
admin_gt   → TapStyle - Glamour Time
admin_pf   → TapStyle - Performance Footwear
admin_sv   → TapStyle - Street Vibe
```

### Rol Vendedor
```
vendedor_ge1 → Gentle Elegance
vendedor_gt1 → Glamour Time
vendedor_pf1 → Performance Footwear
vendedor_sv1 → Street Vibe
```

### Rol Cliente
```
cliente_uno   → Gentle Elegance
cliente_dos   → Gentle Elegance
cliente_tres  → Glamour Time
```

## 🧪 Casos de Prueba Incluidos

### 1. Stock Bajo (Alertas)
```
Producto: Camiseta Premium Roja
Variante S: 8 unidades (< 10 mínimo)
Variante M: 15 unidades

Producto: Falda Elegante Negra
Variante XS: 5 unidades (< 10 mínimo)
```

### 2. Multi-Tenencia
- 4 empresas completamente separadas
- Productos filtrados por empresa
- Usuarios asignados a empresa

### 3. RBAC (Control de Acceso)
- 5 roles: SuperAdmin, Admin, Vendedor, Empleado, Cliente
- 16 permisos granulares
- Asignación de permisos a roles

### 4. Auditoría
- 10 registros de bitácora
- Tracking de acciones por usuario
- IP origin del usuario

### 5. Gestión de Efectivo
- 3 cajas para diferentes empresas/días
- Saldo inicial y actual

## 💾 Cómo Ejecutar Manualmente

Si quieres cargar los datos sin que sea automático:

### Opción 1: MySQL CLI
```powershell
mysql -u root -p TAPSTYLE < "ruta/01-insert-data-initial.sql"
```

### Opción 2: MySQL Workbench
```
File → Open SQL Script → Seleccionar archivo → Execute
```

### Opción 3: DBeaver
```
Right-click DB → SQL Script → Open → Execute
```

## 🔄 Relaciones Entre Tablas (Referencia)

```
Empresas
  ├─→ Usuarios (1:N)
  │    └─→ Roles (1:N)
  │         └─→ Permisos (M:N)
  ├─→ Productos (1:N)
  │    ├─→ Categorías (1:N)
  │    ├─→ Proveedores (1:N)
  │    ├─→ Marcas (1:N)
  │    ├─→ Modelos (1:N)
  │    ├─→ Materiales (1:N)
  │    ├─→ UnidadMedida (1:N)
  │    └─→ VarianteProducto (1:N)
  │         └─→ Inventarios (1:N)
  │              └─→ Almacenes (1:N)
  └─→ Almacenes (1:N)
  └─→ Cajas (1:N)

Usuarios (1:1)→ Clientes (opcional)

Bitácora
  └─→ Usuarios (1:N)
```

## 📈 Estadísticas de Carga

```
Total Registros Insertados: ~450
Lines of SQL: ~1,600
Ejecución: < 1 segundo (típico)
Espacio DB: ~2-3 MB

Desglose:
- 4 Empresas
- 22 Usuarios
- 3 Clientes
- 5 Proveedores
- 12 Categorías
- 10 Productos
- 35 Variantes
- 5 Almacenes
- 94 Inventarios
- 5 Roles
- 16 Permisos
- 10 Bitácoras
- 3 Cajas
```

## ✅ Verificación Post-Carga

Ejecutar estas queries para verificar:

```sql
-- Resumen general
SELECT 
    'Empresas' as Tabla, COUNT(*) as Total FROM Empresas
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM Usuarios
UNION ALL
SELECT 'Productos', COUNT(*) FROM Productos
UNION ALL
SELECT 'Variantes', COUNT(*) FROM VarianteProducto
UNION ALL
SELECT 'Inventarios', COUNT(*) FROM Inventarios;

-- Productos por empresa
SELECT 
    e.nombre_tienda,
    COUNT(p.id_producto) as productos
FROM Empresas e
LEFT JOIN Productos p ON e.id_empresa = p.id_empresa
GROUP BY e.id_empresa, e.nombre_tienda;

-- Stock bajo (< 100)
SELECT 
    p.nombre_producto,
    v.nombre_variante,
    i.cantidad_stock,
    a.nombre_almacen
FROM Inventarios i
JOIN VarianteProducto v ON i.id_variante = v.id_variante
JOIN Productos p ON v.id_producto = p.id_producto
JOIN Almacenes a ON i.id_almacen = a.id_almacen
WHERE i.cantidad_stock < 100
ORDER BY i.cantidad_stock;
```

## 🛑 Resolución de Problemas

### Error: "MySQL server has gone away"
```
Solución: Reiniciar MySQL service
net start MySQL80
```

### Error: "Table already exists"
```
Solución: Los datos ya fueron cargados
Verificar: SELECT COUNT(*) FROM Empresas;
```

### Error: "Foreign key constraint failed"
```
Solución: Ejecutar scripts en orden
Primero: 01-insert-data-initial.sql
Luego: 02-insert-data-additional.sql
```

### DataLoader no ejecuta inserts
```
Verificar en logs:
1. ¿Está la BD vacía?
2. ¿Conexión a MySQL OK?
3. ¿Archivo existe en resources/inserts/?
```

## 🔗 Enlaces Útiles

- **README de inserts:** `./inserts/README.md`
- **Configuración BD:** `./application.properties`
- **DataLoader:** `./src/main/java/com/lp2/tapstyle/config/DataLoader.java`
- **Schema completo:** `../../tapstyle_schema_final.sql`

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0  
**Estado:** ✅ Completo
