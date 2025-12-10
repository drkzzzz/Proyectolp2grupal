// ================================================================
// CARRITO Y COMPRA - Sistema completo integrado con backend
// ================================================================

class CarritoCompra {
    constructor() {
        this.API_BASE = 'http://127.0.0.1:8083/api';
        this.usuario = null;
        this.tiendaId = null;
        this.carrito = [];
        this.inicializar();
    }

    inicializar() {
        // Verificar si el usuario está logueado
        const usuarioGuardado = localStorage.getItem('tapstyle_user');
        if (!usuarioGuardado) {
            console.log('❌ Usuario no logueado');
            return false;
        }

        try {
            this.usuario = JSON.parse(usuarioGuardado);
            console.log('✅ Usuario logueado:', this.usuario.email);
        } catch (e) {
            console.error('Error al parsear usuario:', e);
            return false;
        }

        // Obtener ID de tienda de URL
        const urlParams = new URLSearchParams(window.location.search);
        this.tiendaId = urlParams.get('tienda_id');
        if (!this.tiendaId) {
            this.tiendaId = localStorage.getItem('tienda_actual_id');
        }

        console.log('🏪 Tienda ID:', this.tiendaId);
        this.cargarCarrito();
        return true;
    }

    // Cargar carrito del localStorage
    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito_items');
        this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
        console.log('📦 Carrito cargado:', this.carrito);
        this.actualizarUI();
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        // Guardar en carrito_items (el principal)
        localStorage.setItem('carrito_items', JSON.stringify(this.carrito));
        // También guardar en carrito_tienda para compatibilidad con página de carrito
        localStorage.setItem('carrito_tienda', JSON.stringify(this.carrito));
        console.log('💾 Carrito guardado en localStorage (carrito_items y carrito_tienda):', this.carrito);
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        console.log('➕ Agregando producto:', producto);

        if (!this.usuario) {
            alert('❌ Debes iniciar sesión para agregar productos');
            this.abrirLogin();
            return false;
        }

        // Buscar si el producto ya está en el carrito
        const itemExistente = this.carrito.find(
            item => item.idProductoVariante === producto.idProductoVariante
        );

        if (itemExistente) {
            itemExistente.cantidad += (producto.cantidad || 1);
        } else {
            this.carrito.push({
                id: producto.idProductoVariante,  // Alias para compatibilidad
                idProductoVariante: producto.idProductoVariante,
                nombreProducto: producto.nombreProducto || 'Producto',
                precio: producto.precio || 0,
                cantidad: producto.cantidad || 1,
                imagen: producto.imagen || '',
                tiendaId: this.tiendaId
            });
        }

        this.guardarCarrito();
        this.actualizarUI();
        this.mostrarNotificacion('✅ Producto agregado al carrito');
        return true;
    }

    // Eliminar producto del carrito
    eliminarProducto(idVariante) {
        this.carrito = this.carrito.filter(
            item => item.idProductoVariante !== idVariante
        );
        this.guardarCarrito();
        this.actualizarUI();
    }

    // Actualizar cantidad
    actualizarCantidad(idVariante, cantidad) {
        const item = this.carrito.find(
            item => item.idProductoVariante === idVariante
        );
        if (item && cantidad > 0) {
            item.cantidad = cantidad;
            this.guardarCarrito();
            this.actualizarUI();
        }
    }

    // Calcular totales
    calcularTotales() {
        const subtotal = this.carrito.reduce(
            (sum, item) => sum + (item.precio * item.cantidad),
            0
        );
        const envio = subtotal > 0 ? 50 : 0; // $50 de envío fijo
        const total = subtotal + envio;

        return { subtotal, envio, total };
    }

    // Actualizar UI del carrito
    actualizarUI() {
        const contador = document.getElementById('cartCount');
        if (contador) {
            const cantidad = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
            contador.textContent = cantidad;
        }

        // Actualizar modal de carrito si está abierto
        this.actualizarModalCarrito();
    }

    // Mostrar modal del carrito
    mostrarModalCarrito() {
        const modal = document.getElementById('modalCarrito');
        if (!modal) return;

        modal.style.display = 'block';
        this.actualizarModalCarrito();
    }

    // Actualizar contenido del modal carrito
    actualizarModalCarrito() {
        const container = document.getElementById('carritoItems');
        if (!container) return;

        if (this.carrito.length === 0) {
            container.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        } else {
            container.innerHTML = this.carrito.map(item => `
                <div class="carrito-item">
                    <div class="item-info">
                        <h4>${item.nombreProducto}</h4>
                        <p>$${item.precio.toFixed(2)}</p>
                    </div>
                    <div class="item-cantidad">
                        <button class="btn-cantidad-carrito" onclick="carritoCompra.actualizarCantidad('${item.idProductoVariante}', ${item.cantidad - 1})">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-cantidad-carrito" onclick="carritoCompra.actualizarCantidad('${item.idProductoVariante}', ${item.cantidad + 1})">+</button>
                    </div>
                    <div class="item-total">
                        <p>$${(item.precio * item.cantidad).toFixed(2)}</p>
                        <button class="btn-eliminar" onclick="carritoCompra.eliminarProducto('${item.idProductoVariante}')">🗑️</button>
                    </div>
                </div>
            `).join('');
        }

        // Actualizar resumen
        const { subtotal, envio, total } = this.calcularTotales();
        document.getElementById('subtotalCarrito').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('envioCarrito').textContent = `$${envio.toFixed(2)}`;
        document.getElementById('totalCarrito').textContent = `$${total.toFixed(2)}`;
    }

    // Proceder a pago
    async procederPago() {
        if (!this.usuario) {
            alert('❌ Debes iniciar sesión');
            this.abrirLogin();
            return;
        }

        if (this.carrito.length === 0) {
            alert('❌ Tu carrito está vacío');
            return;
        }

        // Crear pedido
        const { subtotal, envio, total } = this.calcularTotales();

        console.log('🛒 Carrito para procesar:', this.carrito);
        
        const detalles = this.carrito.map(item => {
            const idVariante = item.idProductoVariante || item.id;
            console.log(`📝 Item: ${item.nombreProducto}, ID: ${idVariante}`);
            return {
                idProductoVariante: idVariante,
                cantidad: item.cantidad,
                precioUnitario: item.precio
            };
        });

        const payload = {
            idUsuario: this.usuario.idUsuario,
            idEmpresa: parseInt(this.tiendaId),
            detalles: detalles,
            montoPago: total,
            montoEnvio: envio,
            estado: 'Pendiente'
        };

        try {
            console.log('📤 Enviando pedido:', payload);

            const response = await fetch(`${this.API_BASE}/pedidos-clientes/checkout-carrito`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tapstyle_token') || ''}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('📥 Respuesta:', data);

            if (data.success || (response.ok && data.data)) {
                console.log('✅ Pedido creado:', data.data);
                this.mostrarConfirmacionCompra(data.data);
                this.vaciarCarrito();
                return data.data;
            } else {
                alert('❌ Error: ' + (data.message || 'No se pudo crear el pedido'));
                return null;
            }
        } catch (error) {
            console.error('❌ Error:', error);
            alert('❌ Error de conexión: ' + error.message);
            return null;
        }
    }

    // Mostrar confirmación de compra
    mostrarConfirmacionCompra(pedido) {
        const modal = document.getElementById('modalCarrito');
        if (!modal) return;

        const container = document.getElementById('carritoItems');
        const { subtotal, envio, total } = this.calcularTotales();

        container.innerHTML = `
            <div class="confirmacion-compra">
                <h3>✅ ¡Compra Realizada!</h3>
                <p>Número de pedido: <strong>#${pedido.idPedido || 'PENDING'}</strong></p>
                <p>Tu pedido ha sido creado exitosamente.</p>
                <p>Recibirás actualizaciones en tu email: ${this.usuario.email}</p>
                <div class="resumen-compra">
                    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                    <p><strong>Envío:</strong> $${envio.toFixed(2)}</p>
                    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
                </div>
            </div>
        `;

        document.getElementById('subtotalCarrito').textContent = '$0.00';
        document.getElementById('envioCarrito').textContent = '$0.00';
        document.getElementById('totalCarrito').textContent = '$0.00';
        document.getElementById('btnProcederPago').textContent = 'Seguir Comprando';
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarUI();
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        // Crear elemento de notificación si no existe
        let notif = document.getElementById('notificacion');
        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'notificacion';
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(notif);
        }

        notif.textContent = mensaje;
        notif.style.display = 'block';
        setTimeout(() => {
            notif.style.display = 'none';
        }, 3000);
    }

    // Abrir login
    abrirLogin() {
        const modal = document.getElementById('modalAuth');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Obtener datos del carrito (para debug)
    obtenerDatos() {
        return {
            usuario: this.usuario,
            tienda: this.tiendaId,
            carrito: this.carrito,
            totales: this.calcularTotales()
        };
    }
}

// Instancia global
let carritoCompra = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    carritoCompra = new CarritoCompra();
});
