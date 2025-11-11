# 📊 Inserts Iniciales - TapStyle Database

Esta carpeta contiene los scripts SQL para cargar datos iniciales en la base de datos de TapStyle.

## 📂 Estructura de Archivos

```
inserts/
├── 01-insert-data-initial.sql      # Script principal con datos de prueba
├── 02-insert-data-additional.sql   # Script adicional con más ejemplos
└── README.md                         # Este archivo
```

## 📋 Contenido de los Scripts

### 01-insert-data-initial.sql
Script principal que contiene:
- **4 Empresas** (Tiendas TapStyle)
- **22 Usuarios** (1 SuperAdmin, 4 Admins, 5 Vendedores, 2 Empleados, 10 Clientes)
- **5 Roles** con permisos RBAC configurados
- **16 Permisos** del sistema
- **3 Clientes** registrados
- **5 Proveedores**
- **5 Tipos de Documento**
- **10 Marcas** (Nike, Adidas, Puma, etc.)
- **10 Materiales** (Algodón, Poliéster, Cuero, etc.)
- **8 Modelos** (Clásico, Deportivo, Casual, etc.)
- **12 Categorías** de productos
- **5 Almacenes**
- **10 Productos** con **35 variantes** (Camisetas, Pantalones, Zapatos, etc.)
- **94 Registros de inventario**

### 02-insert-data-additional.sql
Script complementario con:
- **2 productos adicionales** de prueba
- **5 variantes** extra
- **10 registros de bitácora** (auditoría)
- **3 cajas** (gestión de efectivo)
- **Query de validación** para verificar la carga

## 🚀 Cómo Usar

### Opción 1: Carga Automática (Recomendado)
El backend está configurado con **DataLoader** que carga automáticamente los datos:

```powershell
cd backend
mvn spring-boot:run
```

La aplicación detectará si la base de datos está vacía y cargará automáticamente los inserts.

**Salida esperada:**
```
╔════════════════════════════════════════════════════════════╗
║  Cargando datos iniciales en la base de datos...           ║
╚════════════════════════════════════════════════════════════╝
✓ Datos iniciales cargados correctamente

╔════════════════════════════════════════════════════════════╗
║  RESUMEN DE DATOS CARGADOS EN TAPSTYLE                    ║
╠════════════════════════════════════════════════════════════╣
║  🏢 Empresas:            4                                 ║
║  👥 Usuarios:           22                                 ║
║  📦 Productos:          10                                 ║
║  🏷️  Variantes:         35                                 ║
║  🤝 Proveedores:         5                                 ║
║  🏪 Almacenes:           5                                 ║
║  📊 Registros Inv:      94                                 ║
║  👤 Clientes:            3                                 ║
╚════════════════════════════════════════════════════════════╝
```

### Opción 2: Carga Manual (MySQL CLI)

```powershell
# Conectar a MySQL
mysql -u root -p

# Seleccionar la base de datos
USE TAPSTYLE;

# Ejecutar el script
SOURCE C:\ruta\al\backend\src\main\resources\inserts\01-insert-data-initial.sql;

# Opcional: Cargar datos adicionales
SOURCE C:\ruta\al\backend\src\main\resources\inserts\02-insert-data-additional.sql;
```

### Opción 3: Desde MySQL Workbench

1. Abrir MySQL Workbench
2. Conectar a tu servidor MySQL
3. Seleccionar la base de datos TAPSTYLE
4. Ir a **File → Open SQL Script**
5. Seleccionar `01-insert-data-initial.sql`
6. Ejecutar con **Ctrl + Shift + Enter**

## 👤 Credenciales de Prueba

Después de cargar los datos, puedes usar estas credenciales:

| Usuario | Contraseña | Rol | Empresa |
|---------|-----------|-----|---------|
| `superadmin` | `password` | SuperAdmin | Sistema |
| `admin_ge` | `password` | Admin | Gentle Elegance |
| `admin_gt` | `password` | Admin | Glamour Time |
| `admin_pf` | `password` | Admin | Performance Footwear |
| `admin_sv` | `password` | Admin | Street Vibe |
| `vendedor_ge1` | `password` | Vendedor | Gentle Elegance |
| `vendedor_gt1` | `password` | Vendedor | Glamour Time |
| `cliente_uno` | `password` | Cliente | Gentle Elegance |
| `cliente_dos` | `password` | Cliente | Gentle Elegance |
| `cliente_tres` | `password` | Cliente | Glamour Time |

**Nota:** Todas las contraseñas están hasheadas con BCrypt. El valor mostrado arriba es solo para referencia.

## 📦 Datos de Prueba Disponibles

### Empresas Cargadas
1. **TapStyle - Gentle Elegance** - RUC: 20123456789
2. **TapStyle - Glamour Time** - RUC: 20987654321
3. **TapStyle - Performance Footwear** - RUC: 20555666777
4. **TapStyle - Street Vibe** - RUC: 20888999000

### Productos por Empresa

**Gentle Elegance:**
- Camiseta Básica Premium (4 variantes: S, M, L, XL)
- Camiseta Básica Negra (3 variantes)
- Pantalón Jeans Clásico (4 variantes)
- Zapatillas Deportivas Premium (5 variantes: 36-40)
- Camiseta Premium Roja (2 variantes con stock bajo)

**Glamour Time:**
- Vestido Noche Elegante (3 variantes)
- Blusa Casual Cómoda (3 variantes)
- Falda Elegante Negra (3 variantes con stock bajo)

**Performance Footwear:**
- Zapatillas Running Pro (6 variantes: 37-42)
- Conjunto Deportivo Premium (4 variantes)

**Street Vibe:**
- Camiseta Streetwear Urban (4 variantes)
- Gorra Urban Classic (3 variantes: Negra, Blanca, Azul)

## 🔍 Validación de Datos

Para verificar que los datos se cargaron correctamente:

```sql
-- Contar registros por tabla
SELECT 
    (SELECT COUNT(*) FROM Empresas) as Empresas,
    (SELECT COUNT(*) FROM Usuarios) as Usuarios,
    (SELECT COUNT(*) FROM Productos) as Productos,
    (SELECT COUNT(*) FROM VarianteProducto) as Variantes,
    (SELECT COUNT(*) FROM Inventarios) as Inventario;

-- Ver productos con sus variantes
SELECT 
    p.nombre_producto,
    e.nombre_tienda,
    COUNT(v.id_variante) as variantes,
    SUM(i.cantidad_stock) as stock_total
FROM Productos p
LEFT JOIN Empresas e ON p.id_empresa = e.id_empresa
LEFT JOIN VarianteProducto v ON p.id_producto = v.id_producto
LEFT JOIN Inventarios i ON v.id_variante = i.id_variante
GROUP BY p.id_producto;

-- Ver stock bajo (menor a 100 unidades)
SELECT 
    p.nombre_producto,
    v.nombre_variante,
    a.nombre_almacen,
    i.cantidad_stock
FROM Inventarios i
JOIN VarianteProducto v ON i.id_variante = v.id_variante
JOIN Productos p ON v.id_producto = p.id_producto
JOIN Almacenes a ON i.id_almacen = a.id_almacen
WHERE i.cantidad_stock < 100
ORDER BY i.cantidad_stock ASC;
```

## ⚠️ Importante

1. **Ejecutar en orden**: Primero `01-insert-data-initial.sql`, luego `02-insert-data-additional.sql`
2. **BD vacía**: Los scripts asumen que la base de datos está vacía
3. **Contraseñas**: Todas están hasheadas. Para cambiar, usar el endpoint de login
4. **Datos de prueba**: Son solo para desarrollo y pruebas
5. **Producción**: Adaptar los datos según necesidades reales

## 🔧 Personalización

Para agregar más datos:

1. Copiar un insert existente
2. Cambiar valores (IDs, nombres, etc.)
3. Mantener coherencia con ForeignKeys
4. Ejecutar el nuevo script

**Ejemplo:**
```sql
-- Agregar nueva empresa
INSERT INTO Empresas (nombre_tienda, ruc_empresa, email_contacto, estado_aprobacion) VALUES 
('TapStyle - Mi Tienda', '20999888777', 'info@mitienda.com', 'Aprobada');

-- Agregar usuario admin para esa empresa
INSERT INTO Usuarios (id_empresa, id_rol, nombres, apellidos, username, email, contraseña_hash) VALUES 
(5, 2, 'Admin', 'Mi Tienda', 'admin_mitie', 'admin@mitie.com', '$2a$10$...');
```

## 📞 Soporte

Para problemas al cargar datos:

1. Verificar que MySQL está corriendo
2. Verificar conexión a la base de datos
3. Revisar logs de la aplicación
4. Ejecutar queries de validación

## 📚 Archivos Relacionados

- `../application.properties` - Configuración de BD
- `../TapStyleApplication.java` - Clase principal con DataLoader
- `../../tapstyle_schema_final.sql` - Schema completo
- `../EJEMPLOS_API.md` - Ejemplos de uso de la API

---

**Última actualización:** Noviembre 2025  
**Version:** 1.0  
**Estado:** ✅ Completo y funcional
