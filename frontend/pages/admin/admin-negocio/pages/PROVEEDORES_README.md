# 🚚 MÓDULO DE PROVEEDORES - ADMIN NEGOCIO

## 📋 Descripción

Módulo completamente funcional para la gestión de proveedores en el panel de Admin de Negocio. Permite crear, editar, listar y eliminar proveedores asociados a la empresa del usuario autenticado.

---

## ✅ Estado de Implementación

### Backend (100% Completo)
- ✅ Modelo `Proveedor.java` - Entidad JPA con validaciones
- ✅ DTO `ProveedorDTO.java` - Objeto de transferencia de datos
- ✅ Repository `ProveedorRepository.java` - Queries personalizadas
- ✅ Service `ProveedorService.java` - Lógica de negocio
- ✅ Controller `ProveedorController.java` - Endpoints REST

### Frontend (100% Completo)
- ✅ `proveedores.html` - Interfaz completa con tabla y modal
- ✅ `scripts/proveedores.js` - Lógica de gestión de proveedores
- ✅ `scripts/auth.js` - Autenticación y contexto de empresa
- ✅ `scripts/api.js` - Funciones centralizadas para llamadas API

---

## 🎯 Funcionalidades Implementadas

### 1. **Listar Proveedores**
- Muestra todos los proveedores de la empresa del usuario logueado
- Tabla responsive con información organizada
- Filtrado automático por `idEmpresa`

### 2. **Crear Proveedor**
- Modal con formulario completo
- Validación de campos obligatorios
- Campos implementados:
  - ✅ Razón Social (obligatorio)
  - ✅ Nombre Comercial (obligatorio)
  - ✅ RUC (opcional, máx 11 caracteres)
  - ✅ Rubro (opcional)
  - ✅ Teléfono (opcional)
  - ✅ Email (opcional, con validación)
  - ✅ Dirección (opcional)

### 3. **Editar Proveedor**
- Carga datos existentes en el modal
- Actualiza información mediante PUT
- Mantiene integridad de datos

### 4. **Eliminar Proveedor**
- Confirmación antes de eliminar
- Eliminación permanente
- Recarga automática de tabla

---

## 🔌 Endpoints Utilizados

### Base URL
```
http://localhost:8083/api/proveedores
```

### GET /proveedores/empresa/{idEmpresa}
**Obtener todos los proveedores de una empresa**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "idProveedor": 1,
      "idEmpresa": 122,
      "razonSocial": "Distribuidor ABC S.A.C.",
      "nombreComercial": "ABC Distribuidora",
      "ruc": "20123456789",
      "rubro": "Textiles",
      "direccion": "Av. Los Comerciantes 123, Lima",
      "telefono": "999888777",
      "email": "ventas@abc.com"
    }
  ],
  "mensaje": "Proveedores obtenidos"
}
```

### POST /proveedores
**Crear nuevo proveedor**

**Request:**
```json
{
  "idEmpresa": 122,
  "razonSocial": "Distribuidor XYZ S.A.C.",
  "nombreComercial": "XYZ Distribuidora",
  "ruc": "20987654321",
  "rubro": "Calzado",
  "direccion": "Jr. Industrial 456, Lima",
  "telefono": "987654321",
  "email": "contacto@xyz.com"
}
```

### GET /proveedores/{id}
**Obtener un proveedor específico**

### PUT /proveedores/{id}
**Actualizar proveedor existente**

**Request:** Mismo formato que POST

### DELETE /proveedores/{id}
**Eliminar proveedor**

---

## 📂 Estructura de Archivos

```
frontend/pages/admin/admin-negocio/
│
├── pages/
│   └── proveedores.html          # Interfaz principal
│
├── scripts/
│   ├── auth.js                   # Autenticación y contexto
│   ├── api.js                    # Funciones API centralizadas
│   └── proveedores.js            # Lógica específica de proveedores
│
└── PROVEEDORES_README.md         # Esta documentación
```

---

## 🔐 Seguridad y Autenticación

### Validaciones Implementadas
1. **Token JWT**: Incluido en todas las peticiones
2. **ID Empresa**: Automáticamente inyectado desde contexto
3. **Rol**: Solo usuarios con rol `admin_negocio` o `admin`
4. **Empresa asignada**: Validación de empresa activa

### Headers de Petición
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token_jwt}'
}
```

---

## 🎨 Interfaz de Usuario

### Tabla de Proveedores
- **Columnas**:
  1. Razón Social / Nombre Comercial
  2. RUC
  3. Rubro
  4. Contacto (Teléfono + Email)
  5. Dirección
  6. Acciones (Editar / Eliminar)

### Modal de Formulario
- Diseño limpio y moderno con Tailwind CSS
- Validaciones en tiempo real
- Placeholders informativos
- Botones de acción destacados

### Estados de la Tabla
- **Cargando**: Spinner animado
- **Sin datos**: Mensaje amigable con icono
- **Con datos**: Tabla completa con hover effects

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **Tailwind CSS** - Estilos y responsive design
- **JavaScript ES6+** - Lógica de negocio
- **Font Awesome** - Iconografía

### Backend
- **Spring Boot 3** - Framework principal
- **Spring Data JPA** - Persistencia
- **MySQL** - Base de datos
- **Lombok** - Reducción de boilerplate
- **Jakarta Validation** - Validaciones

---

## 📝 Modelo de Datos

### Tabla: `proveedores`

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `idProveedor` | INT | PK, AUTO_INCREMENT |
| `id_empresa` | INT | FK, NOT NULL |
| `razonSocial` | VARCHAR(255) | NOT NULL |
| `nombreComercial` | VARCHAR(100) | NULL |
| `ruc` | VARCHAR(20) | NULL |
| `rubro` | VARCHAR(100) | NULL |
| `direccion` | VARCHAR(255) | NULL |
| `telefono` | VARCHAR(20) | NULL |
| `email` | VARCHAR(100) | NULL |

### Relaciones
- **Empresa**: Many-to-One (Muchos proveedores pertenecen a una empresa)

---

## 🚀 Cómo Usar

### 1. Iniciar el Backend
```powershell
cd backend
.\mvnw spring-boot:run
```

### 2. Iniciar sesión como Admin de Negocio
- Acceder a: `http://localhost:5500/frontend/pages/admin/login.html`
- Credenciales de prueba:
  - Usuario: `admin@streetvibe.com`
  - Contraseña: `admin123`

### 3. Navegar a Proveedores
- Desde el dashboard, ir a: **Operaciones → Proveedores**
- O directamente: `http://localhost:5500/frontend/pages/admin/admin-negocio/pages/proveedores.html`

### 4. Gestionar Proveedores
- **Crear**: Click en "Nuevo Proveedor"
- **Editar**: Click en icono de lápiz (amarillo)
- **Eliminar**: Click en icono de papelera (rojo)

---

## 🐛 Debugging

### Console Logs
El módulo incluye logs detallados para debugging:

```javascript
// Al cargar proveedores
🚚 Cargando proveedores para empresa: 122
✅ 5 proveedores encontrados

// Al guardar
💾 Guardando proveedor: {...}
✅ Proveedor guardado: {...}

// Al eliminar
🗑️ Eliminando proveedor: 1
✅ Proveedor eliminado
```

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `401 Unauthorized` | Token inválido o expirado | Volver a iniciar sesión |
| `404 Not Found` | Backend no está corriendo | Iniciar backend en puerto 8083 |
| `500 Internal Error` | Error en base de datos | Verificar conexión MySQL |
| "No hay empresa asignada" | Usuario sin empresa | Verificar datos en localStorage |

---

## ✨ Mejoras Futuras

### Pendientes
- [ ] Búsqueda y filtrado de proveedores
- [ ] Paginación para grandes volúmenes
- [ ] Exportación a Excel/PDF
- [ ] Importación masiva desde CSV
- [ ] Estadísticas de compras por proveedor
- [ ] Historial de cambios
- [ ] Validación de RUC con SUNAT API

### Optimizaciones
- [ ] Cache de proveedores en localStorage
- [ ] Lazy loading de tabla
- [ ] Debounce en búsquedas
- [ ] Notificaciones toast en lugar de alerts

---

## 📞 Soporte

Para problemas o consultas:
1. Revisar logs de consola del navegador
2. Verificar logs del backend
3. Comprobar estado de base de datos
4. Revisar documentación en `ENDPOINTS_CATALOGO.md`

---

## 📄 Licencia

Proyecto educativo - Universidad LP2

---

**Última actualización**: Diciembre 2025  
**Estado**: ✅ Producción (Funcional)
