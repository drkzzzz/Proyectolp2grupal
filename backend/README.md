# TapStyle Backend

Backend REST API para el sistema de gestión de tiendas TapStyle, desarrollado con Spring Boot 3.5.6.

## 📋 Características

- ✅ Gestión de Empresas/Tiendas (Multi-tenencia)
- ✅ Autenticación y Autorización (RBAC)
- ✅ Gestión de Usuarios, Roles y Permisos
- ✅ Catálogo de Productos y Variantes
- ✅ Control de Inventario por Almacenes
- ✅ Gestión de Clientes y Proveedores
- ✅ APIs REST completas con validación
- ✅ Base de datos MySQL con JPA/Hibernate

## 🛠️ Requisitos Previos

- Java 17 o superior
- Maven 3.8.9 o superior
- MySQL 8.0 o superior
- Git

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/drkzzzz/Proyectolp2grupal.git
cd Proyectolp2grupal/backend
```

### 2. Crear la base de datos

```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar el script SQL
source ../tapstyle_schema_final.sql
```

### 3. Configurar la base de datos

Editar `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/TAPSTYLE?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=tuContraseña
```

### 4. Compilar y ejecutar

```bash
# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run

# O ejecutar el JAR generado
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

La aplicación estará disponible en `http://localhost:8080/api`

## 📚 Estructura del Proyecto

```
backend/
├── src/main/java/com/lp2/tapstyle/
│   ├── config/          # Configuraciones (Security, CORS, etc.)
│   ├── controller/      # REST Controllers
│   ├── dto/             # Data Transfer Objects
│   ├── model/           # Entidades JPA
│   ├── repository/      # Interfaces Repository
│   ├── service/         # Lógica de negocio
│   └── TapStyleApplication.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## 🔌 Endpoints Principales

### Empresas
- `GET /api/empresas` - Obtener todas las empresas
- `GET /api/empresas/{id}` - Obtener empresa por ID
- `POST /api/empresas` - Crear nueva empresa
- `PUT /api/empresas/{id}` - Actualizar empresa
- `DELETE /api/empresas/{id}` - Eliminar empresa

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `GET /api/usuarios/username/{username}` - Obtener usuario por username
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/empresa/{empresaId}` - Obtener productos por empresa
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

## 📝 Ejemplo de Request

```bash
# Crear empresa
curl -X POST http://localhost:8080/api/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "nombreTienda": "Mi Tienda",
    "rucEmpresa": "12345678901",
    "direccionLegal": "Calle Principal 123",
    "telefono": "555-1234",
    "emailContacto": "contacto@mitienda.com",
    "estadoAprobacion": "Aprobada"
  }'

# Obtener empresas
curl http://localhost:8080/api/empresas
```

## 🔐 Seguridad

- JWT Token Authentication (próxima implementación)
- CORS habilitado para desarrollo
- CSRF deshabilitado (API REST)
- Validación de datos en DTOs
- Password Encoder BCrypt

## 📋 Dependencias Principales

- Spring Boot 3.5.6
- Spring Data JPA
- Spring Security
- MySQL Connector/J
- Lombok
- JWT (jjwt-0.11.5)

## 🐛 Troubleshooting

### Error de conexión a MySQL
```
Verificar que MySQL está corriendo:
- Windows: services.msc → buscar MySQL
- Linux: systemctl status mysql
- macOS: brew services list | grep mysql
```

### Error de DDL
```
Si recibe errores de creación de tablas:
1. Asegurar que la BD está creada (source tapstyle_schema_final.sql)
2. Cambiar spring.jpa.hibernate.ddl-auto=update en application.properties
3. Limpiar la BD si es necesario
```

## 📞 Soporte

Para dudas o reportar bugs, contactar al equipo de desarrollo.

## 📄 Licencia

Este proyecto es parte del curso LP2 - Grupo LP2

---

**Última actualización:** Noviembre 2024
