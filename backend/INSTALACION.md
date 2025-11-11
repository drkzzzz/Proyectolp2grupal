# 🚀 GUÍA DE INSTALACIÓN Y EJECUCIÓN - TapStyle Backend

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Mínimos Requeridos:
- **Java 17+** ([Descargar](https://adoptium.net/))
- **MySQL 8.0+** ([Descargar](https://dev.mysql.com/downloads/mysql/))
- **Maven 3.8.9+** (incluido con Maven Wrapper)
- **Git** ([Descargar](https://git-scm.com/))

### Para Desarrollo:
- **IntelliJ IDEA** o **VS Code** (recomendado)
- **Postman** (para testing de API)
- **Git Bash** o terminal de tu preferencia

---

## ✅ Paso 1: Preparar el Entorno

### 1.1 Verificar Java
```bash
java -version
# Debe mostrar: openjdk version "17" o superior
```

### 1.2 Verificar Maven
```bash
mvn -version
# Debe mostrar: Apache Maven 3.8.9 o superior
```

### 1.3 Verificar MySQL
```bash
mysql --version
# Debe mostrar: mysql Ver X.X.X
```

Si alguno falta, instálalo desde los enlaces proporcionados.

---

## 🔧 Paso 2: Clonar el Repositorio

```bash
# Navegar a la carpeta donde quieras guardar el proyecto
cd C:\Users\tu_usuario\Documents

# Clonar el repositorio
git clone https://github.com/drkzzzz/Proyectolp2grupal.git

# Navegar al proyecto
cd Proyectolp2grupal/backend
```

---

## 🗄️ Paso 3: Crear la Base de Datos

### 3.1 Iniciar MySQL
```bash
# En Windows
mysql -u root -p

# En Linux/Mac
sudo mysql -u root -p
```

### 3.2 Ejecutar el Script SQL
```sql
-- Una vez dentro de MySQL:

-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS TAPSTYLE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE TAPSTYLE;

-- Ejecutar el archivo SQL (opción 1: copiar contenido)
-- source /ruta/a/tapstyle_schema_final.sql

-- O manualmente crear las tablas del archivo tapstyle_schema_final.sql
```

### 3.3 Verificar Tablas Creadas
```sql
SHOW TABLES;
-- Debe mostrar todas las tablas: Empresas, Usuarios, Productos, etc.

-- Ver estructura de una tabla
DESCRIBE Empresas;
```

---

## ⚙️ Paso 4: Configurar la Aplicación

### 4.1 Editar application.properties

Abre el archivo: `backend/src/main/resources/application.properties`

Actualiza estos valores según tu configuración de MySQL:

```properties
# Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/TAPSTYLE?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=  # Deja vacío si MySQL no tiene contraseña, o agrega la tuya

# JPA - Hibernate
spring.jpa.hibernate.ddl-auto=update  # create, create-drop, update, validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.root=INFO
logging.level.com.lp2.tapstyle=DEBUG
```

### 4.2 Opciones de ddl-auto
| Opción | Descripción |
|--------|-------------|
| **create** | Crea nuevas tablas (borra las existentes) |
| **create-drop** | Crea y elimina al cerrar la aplicación |
| **update** | Actualiza las tablas existentes (RECOMENDADO) |
| **validate** | Solo valida sin modificar |
| **none** | No hace nada |

**Recomendación:** Usa `update` durante desarrollo.

---

## 🏗️ Paso 5: Compilar el Proyecto

Abre una terminal en la carpeta `backend/` y ejecuta:

```bash
# Limpiar y compilar
mvn clean install

# Esto descargará todas las dependencias y compilará el proyecto
# Puede tomar 2-5 minutos en la primera ejecución
```

### ✅ Compilación Exitosa
Debes ver en la terminal:
```
[INFO] BUILD SUCCESS
[INFO] Total time: X.XXs
```

### ❌ Si hay errores
```bash
# Verificar problema de conexión a Maven Central
mvn clean install -X

# Limpiar caché local
mvn clean

# Reintentar
mvn install
```

---

## 🚀 Paso 6: Ejecutar la Aplicación

### Opción 1: Con Maven (Recomendado durante desarrollo)
```bash
mvn spring-boot:run

# Verás en consola:
# ....  : Started TapStyleApplication in X.XXX seconds
# ....  : Tomcat started on port(s): 8080
```

### Opción 2: Generar JAR y Ejecutar
```bash
# Generar JAR
mvn clean package

# Ejecutar (en la carpeta target)
java -jar target/backend-0.0.1-SNAPSHOT.jar

# O desde el proyecto
java -jar target/backend-0.0.1-SNAPSHOT.jar --server.port=8080
```

### Opción 3: Desde IDE (IntelliJ IDEA)
1. Abre el proyecto en IntelliJ
2. Click derecho en `TapStyleApplication.java`
3. Selecciona `Run 'TapStyleApplication'`
4. La aplicación se ejecutará en puerto 8080

---

## ✅ Paso 7: Verificar que Funciona

### 7.1 Verificar que el servidor está corriendo
```bash
# Desde otra terminal, prueba este comando:
curl http://localhost:8080/api/empresas

# Debes recibir una respuesta JSON (vacía si no hay datos):
# []
```

### 7.2 Probar con Postman
1. Abre Postman
2. Crea una nueva request GET
3. URL: `http://localhost:8080/api/empresas`
4. Click en Send
5. Debes recibir una respuesta exitosa

### 7.3 Insertar datos de prueba

Usa Postman o curl para crear datos:

```bash
# Crear una empresa
curl -X POST http://localhost:8080/api/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "nombreTienda": "Mi Primera Tienda",
    "rucEmpresa": "20123456789",
    "direccionLegal": "Calle Principal 123",
    "telefono": "555-1234",
    "emailContacto": "contacto@mitienda.com",
    "estadoAprobacion": "Aprobada"
  }'
```

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Connection refused: connect"
**Causa:** MySQL no está corriendo  
**Solución:**
```bash
# Windows - iniciar servicio MySQL
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
```

### ❌ Error: "Access denied for user 'root'@'localhost'"
**Causa:** Contraseña incorrecta en application.properties  
**Solución:**
```bash
# Verifica tu contraseña MySQL
mysql -u root -p
# Actualiza en application.properties
```

### ❌ Error: "Unknown database 'TAPSTYLE'"
**Causa:** La BD no existe  
**Solución:**
```sql
CREATE DATABASE TAPSTYLE CHARACTER SET utf8mb4;
USE TAPSTYLE;
-- Ejecuta el script SQL
```

### ❌ Error: "Port 8080 already in use"
**Causa:** Otro proceso usa el puerto 8080  
**Solución:**
```bash
# Cambiar puerto en application.properties
server.port=8081

# O matar el proceso (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### ❌ Error: "Could not resolve all artifact dependencies"
**Causa:** Problemas con Maven Central Repository  
**Solución:**
```bash
# Limpiar caché
rm -rf ~/.m2/repository
mvn clean install
```

---

## 📊 Estructura de Datos Inicial

Al ejecutar, se crearán automáticamente estas tablas:

```sql
-- Ver todas las tablas
SHOW TABLES;

-- Tablas principales:
Empresas
Usuarios
Roles
Productos
VariantesProducto
Inventario
Clientes
Proveedores
... (y muchas más)
```

### Insertar Datos Iniciales (Opcional)

```sql
USE TAPSTYLE;

-- Crear rol
INSERT INTO Roles (nombre_rol, estado, descripcion) 
VALUES ('Administrador', TRUE, 'Acceso total al sistema');

-- Crear categoría
INSERT INTO CategoriasProducto (nombre_categoria, descripcion) 
VALUES ('Calzado', 'Productos de calzado en general');

-- Crear unidad de medida
INSERT INTO UnidadesMedida (nombre_unidad, abreviatura) 
VALUES ('Pares', 'PAR');
```

---

## 📚 Documentación Relacionada

Consulta estos archivos para más información:

- **README.md**: Introducción y características del backend
- **BACKEND_STRUCTURE.md**: Estructura detallada del proyecto
- **EJEMPLOS_API.md**: Ejemplos completos de todos los endpoints

---

## 🎯 Próximos Pasos

Una vez que el backend esté corriendo:

1. ✅ Prueba todos los endpoints con Postman
2. ✅ Verifica que los datos se guardan en MySQL
3. ✅ Integra con el frontend (si existe)
4. ✅ Implementa autenticación JWT
5. ✅ Agrega tests unitarios

---

## 💡 Tips Útiles

### Ver logs en tiempo real
```bash
# Tail los últimos 100 líneas
mvn spring-boot:run | tail -100

# Guardar logs en archivo
mvn spring-boot:run > app.log 2>&1 &
```

### Recargar cambios sin reiniciar
```bash
# Agregar spring-boot-devtools en pom.xml (ya incluido)
# Los cambios en código se recargan automáticamente
```

### Debuggear la aplicación
```bash
# Agregar breakpoints en IntelliJ IDEA
# Ejecutar en modo debug: Shift+F9
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en la consola
2. Verifica la configuración de application.properties
3. Confirma que MySQL está corriendo
4. Consulta la sección de troubleshooting de README.md

---

## ✨ ¡Listo para Desarrollar!

Una vez que todo está configurado y funcionando:

```bash
# Terminal 1: Ejecutar el backend
cd backend
mvn spring-boot:run

# Terminal 2: Desarrollar el frontend
cd ../frontend
npm install
npm start

# Terminal 3: Monitorear la BD
mysql -u root -p TAPSTYLE
```

---

**Versión:** 1.0.0  
**Actualizado:** Noviembre 2024  
**Estado:** ✅ Funcional y probado

¡El backend está listo para desarrollar! 🚀
