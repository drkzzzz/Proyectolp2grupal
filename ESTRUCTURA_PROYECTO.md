# 📁 Estructura del Proyecto TapStyle

## Organización de Carpetas

```
Proyectolp2grupal/
├── backend/                    # API REST (Spring Boot)
│   └── Puerto 8083
│
├── frontend/                   # TODO EL FRONTEND
│   ├── admin/                 # Panel de Administración
│   │   ├── login.html         # Login para SuperAdmin y Admin Negocio
│   │   ├── dashboard_superadmin.html
│   │   └── dashboard_admin_negocio.html
│   │
│   └── cliente/               # Web Pública (Clientes)
│       └── login.html         # Login para clientes
│
├── docs/                      # Documentación
└── *.sql                      # Scripts de base de datos
```

## 🎯 Archivos Principales

### Frontend Admin
- **Ubicación**: `frontend/admin/`
- **Login**: `frontend/admin/login.html`
- **Credenciales de prueba**: 
  - Usuario: `Santi`
  - Password: `12345`
  - Rol: SuperAdmin

### Frontend Cliente
- **Ubicación**: `frontend/cliente/`  
- **Login**: `frontend/cliente/login.html`

## ⚠️ Carpetas Antiguas (IGNORAR)

Las siguientes carpetas contienen archivos duplicados y deben ser ignoradas:
- ❌ `tapstyle-admin/` - Versión antigua del panel admin
- ❌ `TapStyle/mockups/` - Mockups antiguos

**Usar SOLO la carpeta `frontend/` de ahora en adelante.**

## 🚀 Cómo Ejecutar

### Backend
```bash
cd backend
mvn spring-boot:run
```
Servidor en: `http://localhost:8083`

### Frontend
Abrir directamente los archivos HTML en el navegador:
- Admin: `file:///E:/SEPTIMO%20CICLO/LP2/Proyectolp2grupal/frontend/admin/login.html`
- Cliente: `file:///E:/SEPTIMO%20CICLO/LP2/Proyectolp2grupal/frontend/cliente/login.html`
