/**
 * Utilidades para Control de Acceso (RBAC)
 * Funciones para verificar permisos del usuario
 */

// Guardar permisos en localStorage al hacer login
function guardarPermisos(permisos) {
    if (permisos && Array.isArray(permisos)) {
        localStorage.setItem('user_permissions', JSON.stringify(permisos));
    } else if (permisos && typeof permisos === 'object') {
        // Si viene como Set desde backend, convertir a array
        localStorage.setItem('user_permissions', JSON.stringify(Array.from(permisos)));
    }
}

// Obtener permisos del usuario actual
function obtenerPermisos() {
    const permisos = localStorage.getItem('user_permissions');
    return permisos ? JSON.parse(permisos) : [];
}

// Verificar si el usuario tiene un permiso específico
// Verificar si el usuario tiene un permiso específico
function tienePermiso(nombrePermiso) {
    // FIX: Admin siempre tiene acceso a todo (Case insensitive)
    let rol = localStorage.getItem('tapstyle_role');
    const usuarioStr = localStorage.getItem('tapstyle_user');
    let username = '';

    if (usuarioStr) {
        try {
            const u = JSON.parse(usuarioStr);
            username = u.username || u.nombre || '';
        } catch (e) { }
    }

    // 1. Super-Admin Bypass por usuario o rol
    if (username === 'Santis' || username === 'Santiago' || username === 'admin') return true;

    if (rol) {
        rol = rol.toLowerCase().trim();
        if (rol === 'superadmin' || rol === 'admin' || rol === 'admin_negocio' || rol.includes('admin') || rol.includes('dueño')) {
            return true;
        }
    }

    // 2. Obtener permisos reales
    const permisos = obtenerPermisos();

    // 3. Permiso real
    if (permisos.includes(nombrePermiso)) return true;

    // 4. FALLBACK DE EMERGENCIA (Si la BD no devolvió permisos)
    if (permisos.length === 0) {
        console.warn('⚠️ Usando permisos fallback locales por falta de datos en BD');
        if (rol && (rol.includes('vendedor') || rol.includes('empleado'))) {
            const permisosBasicos = [
                'VER_DASHBOARD',
                'VER_PRODUCTOS',
                'VER_CATEGORIAS',
                'VER_CLIENTES',
                'VER_COMPRAS',
                'VER_VENTAS'
            ];
            return permisosBasicos.includes(nombrePermiso);
        }
    }

    return false;
}

// Verificar si el usuario tiene AL MENOS UNO de los permisos
function tieneAlgunPermiso(permisosRequeridos) {
    const permisos = obtenerPermisos();
    return permisosRequeridos.some(p => permisos.includes(p));
}

// Verificar si el usuario tiene TODOS los permisos
function tieneTodosPermisos(permisosRequeridos) {
    const permisos = obtenerPermisos();
    return permisosRequeridos.every(p => permisos.includes(p));
}

// Limpiar permisos al logout
function limpiarPermisos() {
    localStorage.removeItem('user_permissions');
}

// Mapa de módulos y sus permisos requeridos
const MODULOS_PERMISOS = {
    'dashboard': 'VER_DASHBOARD',
    'productos': 'VER_PRODUCTOS',
    'categorias': 'VER_CATEGORIAS',
    'marcas': 'VER_MARCAS',
    'compras': 'VER_COMPRAS',
    'ventas': 'VER_VENTAS',
    'stock': 'VER_STOCK',
    'proveedores': 'VER_PROVEEDORES',
    'metodos_pago': 'VER_METODOS_PAGO',
    'caja': 'VER_CAJA',
    'finanzas': 'VER_FINANZAS',
    'clientes': 'VER_CLIENTES',
    'roles': 'VER_ROLES',
    'permisos': 'VER_PERMISOS',
    'usuarios': 'VER_USUARIOS'
};

// Ocultar elementos del DOM que requieren permisos
function ocultarElementosSinPermiso() {
    document.querySelectorAll('[data-permiso]').forEach(elemento => {
        const permisoRequerido = elemento.getAttribute('data-permiso');
        if (!tienePermiso(permisoRequerido)) {
            elemento.style.display = 'none';
        }
    });
}

// Aplicar control de acceso al sidebar
function aplicarControlAccesoSidebar() {
    // Lista de módulos con sus IDs y permisos requeridos
    const modulosSidebar = [
        { selector: 'a[href*="dashboard"]', permiso: 'VER_DASHBOARD' },
        { selector: 'a[href*="productos.html"]', permiso: 'VER_PRODUCTOS' },
        { selector: 'a[href*="categorias.html"]', permiso: 'VER_CATEGORIAS' },
        { selector: 'a[href*="marcas.html"]', permiso: 'VER_MARCAS' },
        { selector: 'a[href*="compras.html"]', permiso: 'VER_COMPRAS' },
        { selector: 'a[href*="ventas.html"]', permiso: 'VER_VENTAS' },
        { selector: 'a[href*="stock.html"]', permiso: 'VER_STOCK' },
        { selector: 'a[href*="proveedores.html"]', permiso: 'VER_PROVEEDORES' },
        { selector: 'a[href*="metodos_pago.html"]', permiso: 'VER_METODOS_PAGO' },
        { selector: 'a[href*="caja.html"]', permiso: 'VER_CAJA' },
        { selector: 'a[href*="finanzas"]', permiso: 'VER_FINANZAS' },
        { selector: 'a[href*="clientes.html"]', permiso: 'VER_CLIENTES' },
        { selector: 'a[href*="roles"]', permiso: 'VER_ROLES' },
        { selector: 'a[href*="permisos"]', permiso: 'VER_PERMISOS' },
        { selector: 'a[href*="usuarios"]', permiso: 'VER_USUARIOS' }
    ];

    modulosSidebar.forEach(modulo => {
        const elementos = document.querySelectorAll(modulo.selector);
        elementos.forEach(elemento => {
            if (!tienePermiso(modulo.permiso)) {
                // Ocultar el enlace
                elemento.style.display = 'none';

                // Si es un item de lista, ocultar todo el <li>
                const li = elemento.closest('li');
                if (li) li.style.display = 'none';
            }
        });
    });
}

// Verificar acceso a la página actual
function verificarAccesoPagina() {
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop();

    // Mapa de archivos -> permisos
    const archivoPermisos = {
        // 'dashboard_admin_negocio.html': 'VER_DASHBOARD', // ACCESO LIBRE
        'productos.html': 'VER_PRODUCTOS',
        'categorias.html': 'VER_CATEGORIAS',
        'marcas.html': 'VER_MARCAS',
        'compras.html': 'VER_COMPRAS',
        'ventas.html': 'VER_VENTAS',
        'stock.html': 'VER_STOCK',
        'proveedores.html': 'VER_PROVEEDORES',
        'metodos_pago.html': 'VER_METODOS_PAGO',
        'caja.html': 'VER_CAJA',
        'finanzas_pagos.html': 'VER_FINANZAS',
        'clientes.html': 'VER_CLIENTES',
        'roles.html': 'VER_ROLES',
        'permisos.html': 'VER_PERMISOS',
        'usuarios.html': 'VER_USUARIOS'
    };

    const permisoRequerido = archivoPermisos[filename];

    if (permisoRequerido && !tienePermiso(permisoRequerido)) {
        alert('No tienes permiso para acceder a este módulo');
        window.location.href = '../dashboard_admin_negocio.html';
        return false;
    }

    return true;
}

// Inicializar control de acceso al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que el usuario esté logueado
    const usuarioData = localStorage.getItem('tapstyle_user');
    if (!usuarioData) {
        // Si no está logueado, redirigir al login
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = '../../login.html';
        }
        return;
    }

    // ⚠️ SISTEMA DE PERMISOS DESACTIVADO TEMPORALMENTE
    // Sidebar completamente visible para todos los usuarios
    // Para reactivar, descomenta las siguientes líneas:

    // verificarAccesoPagina();
    // aplicarControlAccesoSidebar();
    // ocultarElementosSinPermiso();

    console.log('✅ Sidebar cargado sin restricciones de permisos');
});
