// Configuración global de la tienda
const tiendaConfig = {
    // ID de la tienda se obtiene de parámetro o localStorage (desde admin)
    tiendaId: null,
    nombreTienda: 'Mi Tienda',
    
    // API endpoints
    api: {
        base: 'http://localhost:8083/api',
        productos: '/productos',
        tiendas: '/empresas',
        carrito: '/carrito',
        pedidos: '/pedidos',
        clientes: '/clientes',
        auth: '/auth'
    },

    // Usuario actual (cliente de la tienda)
    usuarioActual: null,

    // Obtener tiendaId desde URL o sessionStorage
    obtenerTiendaId() {
        // Primero intenta desde parámetro de URL
        const params = new URLSearchParams(window.location.search);
        let tiendaId = params.get('tiendaId');
        
        // Si no está en URL, intenta desde sessionStorage (guardado por admin)
        if (!tiendaId) {
            tiendaId = sessionStorage.getItem('tiendaId');
        }
        
        if (!tiendaId) {
            console.error('No se especificó tiendaId');
            alert('Error: No se especificó una tienda válida');
            return null;
        }
        
        this.tiendaId = parseInt(tiendaId);
        return this.tiendaId;
    },

    // Verificar si el cliente está autenticado EN ESTA TIENDA
    estaAutenticado() {
        const token = localStorage.getItem('tapstyle_token');
        const usuario = localStorage.getItem('tapstyle_user');
        return !!(token && usuario);
    },

    // Obtener usuario cliente actual
    obtenerUsuario() {
        if (this.estaAutenticado()) {
            try {
                this.usuarioActual = JSON.parse(localStorage.getItem('tapstyle_user'));
            } catch (e) {
                console.error('Error al parsear usuario:', e);
            }
        }
        return this.usuarioActual;
    },

    // Guardar sesión (reutiliza localStorage de cliente)
    guardarSesion(token, usuario) {
        localStorage.setItem('tapstyle_token', token);
        localStorage.setItem('tapstyle_user', JSON.stringify(usuario));
        this.usuarioActual = usuario;
    },

    // Limpiar sesión
    limpiarSesion() {
        localStorage.removeItem('tapstyle_token');
        localStorage.removeItem('tapstyle_user');
        this.usuarioActual = null;
    },

    // Obtener headers con autenticación
    obtenerHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = localStorage.getItem('tapstyle_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    tiendaConfig.obtenerTiendaId();
    tiendaConfig.obtenerUsuario();
});
