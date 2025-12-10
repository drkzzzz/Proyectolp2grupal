// Utilidades para la tienda
const tiendaUtils = {
    
    // Hacer peticiones a la API
    async hacerPeticion(endpoint, metodo = 'GET', datos = null) {
        try {
            // Construir URL completa
            const urlCompleta = endpoint.startsWith('http') 
                ? endpoint 
                : `${tiendaConfig.api.base}${endpoint}`;

            const opciones = {
                method: metodo,
                headers: tiendaConfig.obtenerHeaders()
            };

            if (datos && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
                opciones.body = JSON.stringify(datos);
            }

            const respuesta = await fetch(urlCompleta, opciones);
            
            if (!respuesta.ok) {
                if (respuesta.status === 401) {
                    // Token expirado o no autenticado
                    tiendaConfig.limpiarSesion();
                }
                throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
            }

            return await respuesta.json();
        } catch (error) {
            console.error('Error en petición:', error);
            throw error;
        }
    },

    // Formatear dinero (estilo Perú S/)
    formatearDinero(cantidad) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(cantidad);
    },

    // Mostrar notificación
    notificacion(mensaje, tipo = 'info') {
        const notif = document.createElement('div');
        notif.className = `notificacion notificacion-${tipo}`;
        notif.textContent = mensaje;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.classList.add('mostrar');
        }, 10);

        setTimeout(() => {
            notif.classList.remove('mostrar');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    },

    // Validar email
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Obtener parámetro de URL
    obtenerParametroURL(nombre) {
        const params = new URLSearchParams(window.location.search);
        return params.get(nombre);
    }
};

// Cargar información de la tienda al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const tiendaId = tiendaConfig.tiendaId;
        if (!tiendaId) return;

        console.log('📦 Cargando datos de tienda:', tiendaId);

        // Obtener datos de la tienda desde el API
        const response = await tiendaUtils.hacerPeticion(
            `${tiendaConfig.api.base}${tiendaConfig.api.tiendas}/${tiendaId}`
        );
        
        // Extraer datos de la respuesta ApiResponse
        const datostienda = response.data || response;
        
        // Actualizar nombre de la tienda
        tiendaConfig.nombreTienda = datostienda.nombreTienda || datostienda.nombre_tienda || datostienda.nombre || 'Mi Tienda';
        document.getElementById('tiendaNombre').textContent = tiendaConfig.nombreTienda;
        
        // Crear sección de información de la tienda
        const tiendaInfo = document.getElementById('tiendaInfo');
        if (tiendaInfo) {
            tiendaInfo.innerHTML = `
                <div class="tienda-header-content">
                    <div class="tienda-detalles">
                        <h1>${tiendaConfig.nombreTienda}</h1>
                        <p>${datostienda.direccionLegal || datostienda.direccion_legal || datostienda.descripcion || 'Bienvenido a nuestra tienda'}</p>
                    </div>
                </div>
            `;
        }

        // Actualizar título de la página
        document.title = `${tiendaConfig.nombreTienda} - TapStyle`;
    } catch (error) {
        console.warn('No se pudo cargar info de tienda, usando datos por defecto:', error);
        // Usar datos por defecto si falla el API
        const nombreDefault = sessionStorage.getItem('tiendaNombre') || 'Mi Tienda';
        tiendaConfig.nombreTienda = nombreDefault;
        document.getElementById('tiendaNombre').textContent = nombreDefault;
    }
});
