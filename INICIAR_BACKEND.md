# 🚀 Iniciar TapStyle Backend con XAMPP

## Opción 1: Script Automático (Recomendado)

Ejecuta este comando en PowerShell:

```powershell
# Desde la raíz del proyecto
.\START_BACKEND.ps1
```

El script hará automáticamente:
1. ✓ Buscar XAMPP en tu sistema
2. ✓ Verificar si MySQL está corriendo
3. ✓ Iniciar MySQL si no está activo
4. ✓ Crear la base de datos TAPSTYLE
5. ✓ Aplicar el schema
6. ✓ Iniciar el backend Spring Boot

---

## Opción 2: Manual (Si el script no funciona)

### Paso 1: Inicia MySQL en XAMPP
```
1. Abre XAMPP Control Panel (C:\xampp\xampp-control.exe)
2. Haz clic en "Start" para el módulo MySQL
3. Espera a que diga "Running"
```

### Paso 2: Crea la base de datos
```powershell
# En tu terminal MySQL o en XAMPP phpMyAdmin
# URL: http://localhost/phpmyadmin

CREATE DATABASE TAPSTYLE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE TAPSTYLE;
SOURCE C:\ruta\a\tapstyle_schema_final.sql;
```

### Paso 3: Inicia el backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

---

## ✓ Verificar que funciona

Cuando veas esto en la consola, el backend está listo:
```
Started BackendApplication in XX.XXX seconds (JVM running for XX.XXX)
Tomcat initialized with port 8080 (http)
```

Prueba accediendo a:
- **Health Check**: http://localhost:8080/api/actuator/health
- **API Base**: http://localhost:8080/api

---

## 🔧 Solucionar problemas

### MySQL no conecta
```
Error: Communications link failure
Solución: Asegúrate de que XAMPP MySQL está en "Running" en el Control Panel
```

### Puerto 8080 en uso
```
Error: Port 8080 already in use
Solución: Cambia el puerto en application.properties: server.port=8081
```

### Base de datos no existe
```
Error: Unknown database 'TAPSTYLE'
Solución: Ejecuta CREATE DATABASE TAPSTYLE; en MySQL
```

---

## 📝 Variables de conexión

El backend usa estas credenciales para MySQL:
- **Usuario**: root
- **Contraseña**: (vacía, por defecto en XAMPP)
- **Host**: localhost:3306
- **Base de datos**: TAPSTYLE

Si cambió la contraseña de root en XAMPP, edita:
```
backend/src/main/resources/application.properties
spring.datasource.password=tu_contraseña_aqui
```

