# 🎯 TapStyle Backend - Guía Rápida de Inicio

## 📋 Resumen

Este backend está **completamente configurado** con:
- ✅ Spring Boot 3.5.6 con todas las dependencias
- ✅ **Datos precargados** (4 empresas, 22 usuarios, 10 productos, etc)
- ✅ Base de datos MySQL mapeada con 18 modelos JPA
- ✅ 9 Controladores REST con endpoints CRUD
- ✅ Sistema de roles y permisos (RBAC)
- ✅ Seguridad con BCrypt y Spring Security
- ✅ **Carga automática de datos** al iniciar

## 🚀 Inicio Rápido

### Opción 1: Ejecutar Script (Windows - RECOMENDADO)

```powershell
# Usar PowerShell
.\run-tapstyle.ps1

# O usar CMD
run-tapstyle.bat
```

El script automáticamente:
1. ✓ Verifica Java y Maven
2. ✓ Compila el proyecto
3. ✓ Inicia el servidor

### Opción 2: Comando Manual

```powershell
# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run
```

### Opción 3: Con Maven Wrapper

```powershell
# Windows
mvnw.cmd spring-boot:run

# PowerShell
./mvnw spring-boot:run
```

## 📊 Datos Que Se Cargan Automáticamente

| Entidad | Cantidad | Descripción |
|---------|----------|-------------|
| Empresas | 4 | Tiendas TapStyle |
| Usuarios | 22 | Todos los roles |
| Productos | 10 | Con variantes |
| Variantes | 35 | Tallas, colores |
| Almacenes | 5 | Por empresa |
| Inventario | 94 | Registros stock |
| Proveedores | 5 | Distribuidor |
| Clientes | 3 | Registrados |
| Categorías | 12 | Productos |
| Marcas | 10 | Nike, Adidas, etc |

## 🔐 Credenciales de Prueba

```
Usuario: superadmin   | Rol: SuperAdmin | Contraseña: password
Usuario: admin_ge     | Rol: Admin      | Contraseña: password
Usuario: vendedor_ge1 | Rol: Vendedor   | Contraseña: password
Usuario: cliente_uno  | Rol: Cliente    | Contraseña: password
```

## 🌐 API Endpoints

El servidor corre en `http://localhost:8080/api`

### Principales Rutas

```
GET    /api/empresas              - Listar empresas
POST   /api/empresas              - Crear empresa
GET    /api/usuarios              - Listar usuarios
POST   /api/auth/register         - Registrar usuario
POST   /api/auth/login            - Login
GET    /api/productos             - Listar productos
POST   /api/productos             - Crear producto
GET    /api/inventario            - Ver inventario
POST   /api/inventario/ajustar    - Ajustar stock
```

Más endpoints en: `EJEMPLOS_API.md`

## 📂 Estructura de Carpetas

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/lp2/tapstyle/
│   │   │   ├── config/          (Seguridad, DataLoader)
│   │   │   ├── controller/      (9 REST Controllers)
│   │   │   ├── dto/             (8 Data Transfer Objects)
│   │   │   ├── exception/       (Manejo global de errores)
│   │   │   ├── model/           (18 Entidades JPA)
│   │   │   ├── repository/      (14 Repositorios)
│   │   │   └── service/         (7 Servicios)
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── db/migration/    (Flyway migrations)
│   │       └── inserts/         (Scripts SQL de datos)
│   └── test/
├── pom.xml                       (Dependencias Maven)
├── mvnw / mvnw.cmd              (Maven Wrapper)
├── run-tapstyle.ps1             (Script PowerShell)
├── run-tapstyle.bat             (Script Batch)
├── INSERTS_GUIDE.md             (Guía completa de datos)
├── DATOS_CARGADOS.txt           (Resumen de datos)
└── README.md                     (Este archivo)
```

## 📦 Scripts de Datos

Los datos se cargan desde `src/main/resources/inserts/`:

- **01-insert-data-initial.sql** - 470 líneas (datos principales)
- **02-insert-data-additional.sql** - 150 líneas (datos adicionales)

El `DataLoader.java` ejecuta automáticamente estos scripts al iniciar.

## ⚙️ Requisitos del Sistema

- **Java 17+** - Descargar desde [oracle.com/java](https://www.oracle.com/java)
- **Maven 3.8.9+** - Incluido (Maven Wrapper)
- **MySQL 8.0+** - Debe estar corriendo
- **Git** (opcional) - Para clonar repo

## 🔧 Configuración

### application.properties

Ubicado en `src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/TAPSTYLE
spring.datasource.username=root
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server
server.port=8080
server.servlet.context-path=/api

# JWT (opcional, para futuro)
jwt.secret=tu-secret-key-super-segura
jwt.expiration=86400000
```

**Cambiar si es necesario según tu configuración MySQL.**

## 📋 Pasos de Instalación

### 1. Crear Base de Datos

```powershell
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS TAPSTYLE;
USE TAPSTYLE;
SOURCE tapstyle_schema_final.sql;
```

### 2. Compilar (Opcional, el script lo hace)

```powershell
mvn clean install
```

### 3. Ejecutar

```powershell
# Opción automática
.\run-tapstyle.ps1

# Opción manual
mvn spring-boot:run
```

### 4. Verificar

```bash
# La consola mostrará:
╔════════════════════════════════════════════════════════╗
║  RESUMEN DE DATOS CARGADOS EN TAPSTYLE               ║
╠════════════════════════════════════════════════════════╣
║  🏢 Empresas:            4                             ║
║  👥 Usuarios:           22                             ║
║  📦 Productos:          10                             ║
║  🏷️  Variantes:         35                             ║
║  🤝 Proveedores:         5                             ║
║  🏪 Almacenes:           5                             ║
║  📊 Registros Inv:      94                             ║
║  👤 Clientes:            3                             ║
╚════════════════════════════════════════════════════════╝
```

## 🧪 Probar la API

### Con Postman

1. Abrir Postman
2. Crear nueva request POST
3. URL: `http://localhost:8080/api/auth/login`
4. Body (JSON):
```json
{
  "username": "superadmin",
  "password": "password"
}
```
5. Send → Deberías obtener un token

### Con cURL

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"password"}'
```

### Ver Productos

```bash
curl http://localhost:8080/api/productos
```

Más ejemplos en: `EJEMPLOS_API.md`

## 📚 Documentación Completa

- **INSERTS_GUIDE.md** - Guía detallada de datos y carga
- **EJEMPLOS_API.md** - 50+ ejemplos de curl para todos los endpoints
- **BACKEND_STRUCTURE.md** - Arquitectura y diseño (en root)
- **GUIA_VISUAL.md** - Diagramas ASCII y guías visuales
- **inserts/README.md** - Información sobre scripts SQL

## ⚠️ Troubleshooting

### Error: "MySQL server has gone away"

```powershell
# Reiniciar MySQL
net start MySQL80

# O usar MySQL Workbench para conectar
```

### Error: "Port 8080 is already in use"

```powershell
# Cambiar puerto en application.properties
server.port=8081

# O matar proceso
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Error: "Cannot find a version of the Java compiler"

```powershell
# Verificar JAVA_HOME
echo $env:JAVA_HOME

# Si no está configurado:
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

### DataLoader no carga datos

```powershell
# 1. Verificar que la BD está vacía
mysql -u root -p
SELECT COUNT(*) FROM Empresas;

# 2. Revisar logs de consola
# 3. Verificar que archivos existen en src/main/resources/inserts/
```

## 🔍 Verificación de Instalación

```sql
-- Conectar a MySQL
mysql -u root -p

-- Verificar que se cargaron los datos
USE TAPSTYLE;
SELECT COUNT(*) as Empresas FROM Empresas;
SELECT COUNT(*) as Usuarios FROM Usuarios;
SELECT COUNT(*) as Productos FROM Productos;
```

## 🎯 Próximos Pasos

1. **Explorar endpoints** - Usar EJEMPLOS_API.md
2. **Agregar más datos** - Editar 02-insert-data-additional.sql
3. **Implementar JWT** - Config está lista en SecurityConfig
4. **Agregar tests** - Crear en src/test/
5. **Deploy** - Docker o servidor Linux

## 📞 Contacto / Soporte

Si encuentras problemas:

1. Revisar **Troubleshooting** arriba
2. Consultar **INSERTS_GUIDE.md** (sección completa de problemas)
3. Revisar logs en consola
4. Verificar conexión MySQL

## 📝 Licencia

Este proyecto es de uso educativo - Proyecto LP2

## ✨ Características

- [x] Spring Boot 3.5.6
- [x] MySQL con 30+ tablas
- [x] 18 Modelos JPA
- [x] 9 Controladores REST
- [x] RBAC con 5 roles
- [x] 16 Permisos granulares
- [x] BCrypt password encoding
- [x] Spring Security
- [x] CORS habilitado
- [x] Validación automática
- [x] Manejo centralizado de errores
- [x] Datos de prueba precargados
- [x] 94 registros de inventario
- [x] Multi-tenencia (4 empresas)
- [x] Auditoría con bitácora

## 🚀 Estado

**✅ COMPLETO Y FUNCIONAL**

Última actualización: Noviembre 2025  
Versión: 1.0

---

**Hecho con ❤️ para TapStyle**
