// ==================================================
// CARRITO DE COMPRAS - MÓDULO JAVASCRIPT
// ==================================================

const CarritoModule = (() => {
    const API_URL = 'http://localhost:8083/api';
    
    let carritoActual = null;
    let usuario = null;
    let empresa = null;

    // Inicializar módulo
    function init() {
        usuario = JSON.parse(localStorage.getItem('usuario'));
        empresa = JSON.parse(localStorage.getItem('empresa'));
        
        if (!usuario || !empresa) {
            console.error('Usuario o empresa no encontrados');
            return;
        }

        cargarCarrito();
    }

    // Obtener carrito del usuario
    async function cargarCarrito() {
        try {
            const response = await fetch(
                `${API_URL}/carrito?idUsuario=${usuario.idUsuario}&idEmpresa=${empresa.idEmpresa}`
            );
            const data = await response.json();
            
            if (data.success) {
                carritoActual = data.data;
                actualizarContadorCarrito();
                return carritoActual;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            return null;
        }
    }

    // Agregar producto al carrito
    async function agregarProducto(idVariante, cantidad = 1) {
        try {
            const response = await fetch(`${API_URL}/carrito/agregar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUsuario: usuario.idUsuario,
                    idEmpresa: empresa.idEmpresa,
                    idVariante: idVariante,
                    cantidad: cantidad
                })
            });

            const data = await response.json();
            
            if (data.success) {
                carritoActual = data.data;
                actualizarContadorCarrito();
                mostrarNotificacion('Producto agregado al carrito', 'success');
                return true;
            } else {
                mostrarNotificacion(data.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
            mostrarNotificacion('Error al agregar producto', 'error');
            return false;
        }
    }

    // Actualizar cantidad de un item
    async function actualizarCantidad(idItemCarrito, nuevaCantidad) {
        try {
            const response = await fetch(
                `${API_URL}/carrito/item/${idItemCarrito}?cantidad=${nuevaCantidad}`,
                { method: 'PUT' }
            );

            const data = await response.json();
            
            if (data.success) {
                carritoActual = data.data;
                actualizarContadorCarrito();
                return true;
            } else {
                mostrarNotificacion(data.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            return false;
        }
    }

    // Eliminar item del carrito
    async function eliminarItem(idItemCarrito) {
        try {
            const response = await fetch(`${API_URL}/carrito/item/${idItemCarrito}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                carritoActual = data.data;
                actualizarContadorCarrito();
                mostrarNotificacion('Producto eliminado', 'success');
                return true;
            } else {
                mostrarNotificacion(data.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Error al eliminar item:', error);
            return false;
        }
    }

    // Vaciar carrito
    async function vaciarCarrito() {
        if (!carritoActual) return false;

        try {
            const response = await fetch(`${API_URL}/carrito/${carritoActual.idCarrito}/vaciar`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                await cargarCarrito();
                mostrarNotificacion('Carrito vaciado', 'success');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al vaciar carrito:', error);
            return false;
        }
    }

    // Actualizar contador en la UI
    function actualizarContadorCarrito() {
        const cantidadTotal = carritoActual?.cantidadTotal || 0;
        const contadores = document.querySelectorAll('#cartCount, .cart-count');
        
        contadores.forEach(contador => {
            contador.textContent = cantidadTotal;
            contador.style.display = cantidadTotal > 0 ? 'inline-block' : 'none';
        });
    }

    // Obtener carrito actual
    function obtenerCarrito() {
        return carritoActual;
    }

    // Mostrar notificación
    function mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notif = document.createElement('div');
        notif.className = `notificacion notif-${tipo}`;
        notif.textContent = mensaje;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            background: ${tipo === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // API pública
    return {
        init,
        cargarCarrito,
        agregarProducto,
        actualizarCantidad,
        eliminarItem,
        vaciarCarrito,
        obtenerCarrito,
        actualizarContadorCarrito
    };
})();

// Estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
