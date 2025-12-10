// ==================================================
// MIS PEDIDOS - LÓGICA
// ==================================================

const API_URL = 'http://localhost:8083/api';

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar módulo de carrito
    CarritoModule.init();
    
    // Verificar autenticación
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '../pages/cliente/login.html';
        return;
    }

    // Cargar pedidos
    await cargarPedidos(usuario.idUsuario);
});

// Cargar pedidos del usuario
async function cargarPedidos(idUsuario) {
    try {
        const response = await fetch(`${API_URL}/pedidos-clientes/usuario/${idUsuario}`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
            renderizarPedidos(data.data);
        } else {
            mostrarSinPedidos();
        }
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        mostrarSinPedidos();
    }
}

// Renderizar lista de pedidos
function renderizarPedidos(pedidos) {
    const lista = document.getElementById('pedidosLista');
    document.getElementById('pedidosVacio').style.display = 'none';

    lista.innerHTML = pedidos.map(pedido => `
        <div class="pedido-card">
            <div class="pedido-header">
                <div>
                    <div class="pedido-numero">${pedido.numeroPedido}</div>
                    <div class="pedido-fecha">
                        ${formatearFecha(pedido.fechaPedido)}
                    </div>
                </div>
                <span class="pedido-estado estado-${pedido.estado}">
                    ${pedido.estado}
                </span>
            </div>

            <div class="pedido-items">
                ${pedido.detalles.map(detalle => `
                    <div class="pedido-item">
                        <img src="${detalle.imagenUrl || 'https://via.placeholder.com/80'}" 
                             alt="${detalle.nombreProducto}"
                             onerror="this.src='https://via.placeholder.com/80'">
                        <div class="pedido-item-info">
                            <h4>${detalle.nombreProducto}</h4>
                            <p>${detalle.nombreVariante} × ${detalle.cantidad}</p>
                        </div>
                        <div class="pedido-item-precio">
                            S/. ${detalle.subtotalLinea.toFixed(2)}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="pedido-footer">
                <div>
                    ${pedido.direccionEnvio ? `
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                            📍 ${pedido.direccionEnvio}
                        </p>
                    ` : ''}
                </div>
                <div class="pedido-total">
                    Total: S/. ${pedido.total.toFixed(2)}
                </div>
            </div>
        </div>
    `).join('');
}

// Mostrar mensaje sin pedidos
function mostrarSinPedidos() {
    document.getElementById('pedidosVacio').style.display = 'block';
    document.getElementById('pedidosLista').innerHTML = '';
}

// Formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', opciones);
}
