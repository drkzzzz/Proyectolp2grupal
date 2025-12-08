// Script para manejar submenús colapsables y autenticación
document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.submenu-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const container = this.parentElement;
            const submenu = container.querySelector('.submenu');
            const icon = this.querySelector('.submenu-icon');
            
            // Cerrar otros submenús
            document.querySelectorAll('.submenu').forEach(sm => {
                if (sm !== submenu) {
                    sm.classList.add('hidden');
                    sm.parentElement.querySelector('.submenu-icon').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle actual
            submenu.classList.toggle('hidden');
            icon.style.transform = submenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });
    
    // Marcar página activa
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('bg-indigo-600', 'text-white');
            link.classList.remove('text-gray-300', 'text-gray-400');
            
            // Abrir submenú si está dentro de uno
            const submenu = link.closest('.submenu');
            if (submenu) {
                submenu.classList.remove('hidden');
                submenu.parentElement.querySelector('.submenu-icon').style.transform = 'rotate(180deg)';
            }
        }
    });
    
    // Validar autenticación
    validarAutenticacion();
});

// Funciones de autenticación
function validarAutenticacion() {
    const token = localStorage.getItem('tapstyle_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
        window.location.href = '/frontend/pages/admin/login.html';
        return false;
    }
    return true;
}

function obtenerContexto() {
    try {
        // Intentar obtener del contexto guardado (para compatibilidad)
        const contexto = localStorage.getItem('contexto');
        if (contexto) {
            const ctx = JSON.parse(contexto);
            return ctx.empresaId || ctx.idEmpresa;
        }
        // Si no existe contexto, intentar obtener idEmpresa directamente
        const idEmpresa = localStorage.getItem('idEmpresa');
        return idEmpresa ? parseInt(idEmpresa) : null;
    } catch (e) {
        console.error('Error obteniendo contexto:', e);
        return localStorage.getItem('idEmpresa');
    }
}

function cerrarSesion() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('contexto');
    localStorage.removeItem('usuario');
    window.location.href = '/frontend/pages/admin/login.html';
}
