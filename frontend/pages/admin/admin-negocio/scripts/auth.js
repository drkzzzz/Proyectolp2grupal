/**
 * AUTH.JS - Gestión de autenticación y contexto para Admin-Negocio
 * 
 * Validar:
 * - Usuario está logueado
 * - Tiene rol admin_negocio
 * - Tiene empresa asignada
 * - Mantener contexto en localStorage
 */

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Validar que el usuario está logueado y tiene acceso a admin-negocio
 * Si no cumple requisitos, redirige a login
 */
function validarAutenticacion() {
    let usuario = null;
    let idEmpresa = null;
    let rol = null;
    let token = null;

    try {
        usuario = JSON.parse(localStorage.getItem('tapstyle_user'));
    } catch (e) {
        console.error('❌ Error parseando usuario:', e);
    }

    try {
        idEmpresa = localStorage.getItem('idEmpresa');
        if (idEmpresa) {
            idEmpresa = parseInt(idEmpresa);
        }
    } catch (e) {
        console.error('❌ Error con idEmpresa:', e);
    }

    rol = localStorage.getItem('tapstyle_role');
    token = localStorage.getItem('tapstyle_token');

    console.log('🔍 Validando autenticación:', {
        usuario: usuario?.nombres || usuario?.nombre,
        idEmpresa,
        rol,
        tokenExiste: !!token
    });

    // Validación 1: Existe usuario
    if (!usuario || (!usuario.idUsuario && !usuario.id_usuario)) {
        console.warn('❌ No hay usuario logueado o ID de usuario no encontrado');
        console.log('Usuario guardado:', usuario);
        redirigirALogin('No hay usuario logueado. Por favor inicia sesión nuevamente.');
        return null;
    }

    // Validación 2: Existe rol correcto (acepta admin_negocio o admin)
    if (rol !== 'admin_negocio' && rol !== 'admin') {
        console.warn(`❌ Rol incorrecto: ${rol}. Se requiere: admin_negocio o admin`);
        redirigirALogin('Tu rol no está autorizado para acceder a este panel.');
        return null;
    }

    // Validación 3: Existe empresa asignada
    if (!idEmpresa || idEmpresa === 0 || isNaN(idEmpresa)) {
        console.warn('❌ No hay empresa asignada o ID de empresa inválido:', idEmpresa);
        redirigirALogin('No hay empresa asignada. Por favor inicia sesión nuevamente.');
        return null;
    }

    // Validación 4: Existe token
    if (!token || token.trim() === '') {
        console.warn('❌ No hay token de autenticación');
        redirigirALogin('Token de autenticación no encontrado. Por favor inicia sesión nuevamente.');
        return null;
    }

    // ✅ Todo validado correctamente
    console.log('✅ Autenticación válida');
    return {
        usuario,
        idEmpresa,
        rol,
        token
    };
}

/**
 * Obtener contexto del usuario (empresa, datos, etc)
 * Retorna un objeto con toda la información necesaria
 */
function obtenerContexto() {
    const usuario = JSON.parse(localStorage.getItem('tapstyle_user'));
    const idEmpresa = parseInt(localStorage.getItem('idEmpresa'));
    const empresaNombre = localStorage.getItem('empresaNombre') || 'Tu Empresa';
    const empresaInitials = localStorage.getItem('empresaInitials') || 'TE';

    return {
        usuario: usuario || {},
        idEmpresa,
        empresaNombre,
        empresaInitials,
        nombreUsuario: usuario?.nombre || 'Usuario'
    };
}

/**
 * Redirigir a login (con mensaje opcional)
 */
function redirigirALogin(mensaje = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.') {
    alert(mensaje);
    window.location.href = '../../admin/login.html';
}

/**
 * Cerrar sesión
 */
function cerrarSesion() {
    localStorage.removeItem('tapstyle_user');
    localStorage.removeItem('tapstyle_token');
    localStorage.removeItem('tapstyle_role');
    localStorage.removeItem('idEmpresa');
    localStorage.removeItem('empresaNombre');
    localStorage.removeItem('empresaInitials');
    
    window.location.href = '../../admin/login.html';
}

/**
 * Verificar que el usuario tiene un permiso específico
 * (Usar cuando implementemos sistema de permisos detallados)
 */
function tienePermiso(permiso) {
    const usuario = JSON.parse(localStorage.getItem('tapstyle_user'));
    const permisos = usuario?.permisos || [];
    return permisos.includes(permiso);
}

// ============================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================

/**
 * Al cargar la página, validar autenticación automáticamente
 */
document.addEventListener('DOMContentLoaded', () => {
    const auth = validarAutenticacion();
    
    if (!auth) {
        // validarAutenticacion ya redirige a login si falla
        return;
    }

    console.log('✅ Autenticación validada:', {
        usuario: auth.usuario.nombre,
        empresa: localStorage.getItem('empresaNombre'),
        rol: auth.rol
    });

    // Actualizar información de usuario en la UI si existen elementos
    actualizarUIUsuario(auth);
});

/**
 * Actualizar elementos de UI con información del usuario
 */
function actualizarUIUsuario(auth) {
    // Obtener información del localStorage
    const empresaNombre = localStorage.getItem('empresaNombre') || 'Tu Empresa';
    const empresaInitials = localStorage.getItem('empresaInitials') || 'TE';
    const nombreUsuario = auth.usuario.nombre || auth.usuario.nombres || 'Usuario';

    console.log('🎨 Actualizando UI con:', {
        empresa: empresaNombre,
        iniciales: empresaInitials,
        usuario: nombreUsuario
    });

    // Buscar elementos que muestren información del usuario
    const elementosUsuario = document.querySelectorAll('[data-usuario-nombre]');
    elementosUsuario.forEach(el => {
        el.textContent = nombreUsuario;
        console.log('✏️ Actualizado usuario:', el.textContent);
    });

    // Buscar elementos que muestren nombre de empresa
    const elementosEmpresa = document.querySelectorAll('[data-empresa-nombre]');
    elementosEmpresa.forEach(el => {
        el.textContent = empresaNombre;
        console.log('✏️ Actualizado empresa:', el.textContent);
    });

    // Buscar elementos que muestren iniciales de empresa
    const elementosIniciales = document.querySelectorAll('[data-empresa-initials]');
    elementosIniciales.forEach(el => {
        el.textContent = empresaInitials;
        console.log('✏️ Actualizado iniciales:', el.textContent);
    });
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarAutenticacion,
        obtenerContexto,
        cerrarSesion,
        tienePermiso,
        redirigirALogin
    };
}
