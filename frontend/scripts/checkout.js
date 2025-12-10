// ==================================================
// CHECKOUT - LÓGICA DE PAGO
// ==================================================

const API_URL = 'http://localhost:8083/api';
let metodosPago = [];
let metodoSeleccionado = null;
let carritoActual = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar
    CarritoModule.init();
    
    // Verificar autenticación
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const empresa = JSON.parse(localStorage.getItem('empresa'));
    
    if (!usuario || !empresa) {
        window.location.href = '../pages/cliente/login.html';
        return;
    }

    // Cargar carrito
    carritoActual = await CarritoModule.cargarCarrito();
    
    if (!carritoActual || !carritoActual.items || carritoActual.items.length === 0) {
        alert('Tu carrito está vacío');
        window.location.href = 'tienda.html';
        return;
    }

    // Cargar datos
    await cargarMetodosPago(empresa.idEmpresa);
    renderizarResumen();

    // Event listeners
    document.getElementById('btnConfirmarPedido').addEventListener('click', confirmarPedido);
});

// Cargar métodos de pago disponibles
async function cargarMetodosPago(idEmpresa) {
    try {
        const response = await fetch(`${API_URL}/metodos-pago?idEmpresa=${idEmpresa}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            metodosPago = data.data.filter(m => m.activo);
            renderizarMetodosPago();
        }
    } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
        mostrarError('Error al cargar métodos de pago');
    }
}

// Renderizar métodos de pago
function renderizarMetodosPago() {
    const container = document.getElementById('metodosPagoContainer');
    
    if (metodosPago.length === 0) {
        container.innerHTML = '<p style="color: #ef4444;">No hay métodos de pago disponibles</p>';
        return;
    }

    container.innerHTML = metodosPago.map(metodo => `
        <div class="metodo-pago-item" data-id="${metodo.idTipoPago}">
            <input type="radio" name="metodoPago" value="${metodo.idTipoPago}" 
                   class="metodo-pago-radio" id="metodo${metodo.idTipoPago}">
            <div class="metodo-pago-info">
                <h4>${metodo.tipoPago}</h4>
                <p>${obtenerDescripcionMetodo(metodo.tipoPago)}</p>
            </div>
        </div>
    `).join('');

    // Event listeners para selección
    document.querySelectorAll('.metodo-pago-item').forEach(item => {
        item.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            seleccionarMetodo(parseInt(radio.value));
            
            // Actualizar UI
            document.querySelectorAll('.metodo-pago-item').forEach(i => 
                i.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Seleccionar método de pago
function seleccionarMetodo(idMetodo) {
    metodoSeleccionado = metodosPago.find(m => m.idTipoPago === idMetodo);
    
    // Mostrar campo de referencia para ciertos métodos
    const referenciaContainer = document.getElementById('referenciaContainer');
    if (['Yape/Plin', 'Transferencia'].includes(metodoSeleccionado?.tipoPago)) {
        referenciaContainer.style.display = 'block';
    } else {
        referenciaContainer.style.display = 'none';
    }
}

// Obtener descripción del método
function obtenerDescripcionMetodo(nombre) {
    const descripciones = {
        'Efectivo': 'Pago al recibir el pedido',
        'Tarjeta': 'Débito o crédito',
        'Yape/Plin': 'Transferencia instantánea',
        'Transferencia': 'Transferencia bancaria'
    };
    return descripciones[nombre] || 'Método de pago';
}

// Renderizar resumen del pedido
function renderizarResumen() {
    const itemsContainer = document.getElementById('itemsResumen');
    
    itemsContainer.innerHTML = carritoActual.items.map(item => `
        <div class="item-resumen">
            <img src="${item.imagenUrl || 'https://via.placeholder.com/60'}" 
                 alt="${item.nombreProducto}"
                 onerror="this.src='https://via.placeholder.com/60'">
            <div class="item-resumen-info">
                <h4>${item.nombreProducto}</h4>
                <p>${item.nombreVariante} × ${item.cantidad}</p>
            </div>
            <div class="item-resumen-precio">
                S/. ${item.subtotal.toFixed(2)}
            </div>
        </div>
    `).join('');

    document.getElementById('checkoutSubtotal').textContent = `S/. ${carritoActual.subtotal.toFixed(2)}`;
    document.getElementById('checkoutIgv').textContent = `S/. ${carritoActual.igv.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `S/. ${carritoActual.total.toFixed(2)}`;
}

// Confirmar pedido
async function confirmarPedido() {
    // Validaciones
    const direccion = document.getElementById('direccionEnvio').value.trim();
    const telefono = document.getElementById('telefonoContacto').value.trim();
    
    if (!direccion || !telefono) {
        mostrarError('Por favor completa la información de envío');
        return;
    }

    if (!metodoSeleccionado) {
        mostrarError('Por favor selecciona un método de pago');
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const empresa = JSON.parse(localStorage.getItem('empresa'));
    const notas = document.getElementById('notas').value.trim();
    const referencia = document.getElementById('referenciaPago').value.trim();

    // Deshabilitar botón
    const btn = document.getElementById('btnConfirmarPedido');
    btn.disabled = true;
    btn.textContent = 'Procesando...';

    try {
        const requestData = {
            idUsuario: usuario.idUsuario,
            idEmpresa: empresa.idEmpresa,
            idCliente: usuario.idCliente || null,
            direccionEnvio: direccion,
            telefonoContacto: telefono,
            notas: notas || null,
            pagos: [{
                idTipoPago: metodoSeleccionado.idTipoPago,
                referenciaPago: referencia || null
            }]
        };

        const response = await fetch(`${API_URL}/pedidos-clientes/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (data.success) {
            // Mostrar éxito
            mostrarExito('¡Pedido creado exitosamente!');
            
            // Limpiar localStorage del carrito antiguo si existe
            localStorage.removeItem('tapstyle_cart');
            
            // Redirigir a página de confirmación
            setTimeout(() => {
                window.location.href = `confirmacion.html?pedido=${data.data.numeroPedido}`;
            }, 1500);
        } else {
            throw new Error(data.message || 'Error al crear el pedido');
        }
    } catch (error) {
        console.error('Error al confirmar pedido:', error);
        mostrarError(error.message || 'Error al procesar el pedido');
        btn.disabled = false;
        btn.textContent = '✓ Confirmar Pedido';
    }
}

// Mostrar error
function mostrarError(mensaje) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: #ef4444;
        color: white;
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Mostrar éxito
function mostrarExito(mensaje) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: #10b981;
        color: white;
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}
