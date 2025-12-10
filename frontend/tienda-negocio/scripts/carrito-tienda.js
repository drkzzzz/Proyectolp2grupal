// Gestión del carrito (Reutilizar estructura de cliente)
const carritoManager = {
    
    // Usa el mismo key que el cliente para persistencia
    CARRITO_KEY: "tapstyle_cart",
    
    items: [],

    // Inicializar carrito desde localStorage
    inicializarCarrito() {
        try {
            const carritoStorage = localStorage.getItem(this.CARRITO_KEY);
            if (carritoStorage) {
                this.items = JSON.parse(carritoStorage);
            } else {
                this.items = [];
            }
        } catch (e) {
            this.items = [];
        }
        this.actualizarContador();
    },

    // Agregar al carrito
    agregarAlCarrito(producto, cantidad) {
        if (!tiendaConfig.estaAutenticado()) {
            tiendaUtils.notificacion('Debes iniciar sesión para comprar', 'info');
            authManager.abrirModal();
            return;
        }

        const existente = this.items.find(item => item.id === producto.id);
        
        if (existente) {
            existente.qty = (existente.qty || 1) + cantidad;
        } else {
            this.items.push({
                id: producto.id,
                name: producto.nombre,
                price: producto.precio,
                image: producto.imagen,
                qty: cantidad
            });
        }

        this.guardarCarrito();
        this.actualizarContador();
        tiendaUtils.notificacion('Producto agregado al carrito', 'exito');
    },

    // Eliminar del carrito
    eliminarDelCarrito(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarContador();
        this.renderizarCarrito();
    },

    // Actualizar cantidad
    actualizarCantidad(id, cantidad) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.qty = Math.max(1, cantidad);
            this.guardarCarrito();
            this.actualizarContador();
            this.renderizarCarrito();
        }
    },

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem(this.CARRITO_KEY, JSON.stringify(this.items));
    },

    // Actualizar contador del carrito
    actualizarContador() {
        const total = this.items.reduce((sum, item) => sum + (item.qty || 1), 0);
        const contador = document.getElementById('cartCount');
        if (contador) {
            contador.textContent = total;
        }
    },

    // Renderizar carrito
    renderizarCarrito() {
        const container = document.getElementById('carritoItems');
        
        if (this.items.length === 0) {
            container.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="carrito-item">
                <img src="${item.image || 'https://via.placeholder.com/80x80?text=Producto'}" alt="${item.name}" class="carrito-item-imagen">
                <div class="carrito-item-info">
                    <h4>${item.name}</h4>
                    <p>${tiendaUtils.formatearDinero(item.price)}</p>
                </div>
                <div class="carrito-item-cantidad">
                    <button class="btn-cantidad-carrito" data-id="${item.id}" data-accion="menos">−</button>
                    <input type="number" value="${item.qty || 1}" class="cantidad-input-carrito" data-id="${item.id}" min="1">
                    <button class="btn-cantidad-carrito" data-id="${item.id}" data-accion="mas">+</button>
                </div>
                <div class="carrito-item-total">
                    <p>${tiendaUtils.formatearDinero((item.price || 0) * (item.qty || 1))}</p>
                </div>
                <button class="btn-eliminar-carrito" data-id="${item.id}">🗑️</button>
            </div>
        `).join('');

        // Event listeners para cantidad
        document.querySelectorAll('.btn-cantidad-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const accion = e.target.dataset.accion;
                const item = this.items.find(i => i.id === id);
                if (item) {
                    this.actualizarCantidad(id, accion === 'mas' ? (item.qty || 1) + 1 : (item.qty || 1) - 1);
                }
            });
        });

        document.querySelectorAll('.cantidad-input-carrito').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.actualizarCantidad(id, parseInt(e.target.value) || 1);
            });
        });

        document.querySelectorAll('.btn-eliminar-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                    this.eliminarDelCarrito(id);
                }
            });
        });

        this.actualizarResumen();
    },

    // Actualizar resumen del carrito
    actualizarResumen() {
        const subtotal = this.items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
        const envio = subtotal > 100 ? 0 : 15; // Envío gratis arriba de 100 soles
        const total = subtotal + envio;

        document.getElementById('subtotalCarrito').textContent = tiendaUtils.formatearDinero(subtotal);
        document.getElementById('envioCarrito').textContent = tiendaUtils.formatearDinero(envio);
        document.getElementById('totalCarrito').textContent = tiendaUtils.formatearDinero(total);
    },

    // Proceder al pago
    async procederAlPago() {
        if (this.items.length === 0) {
            tiendaUtils.notificacion('El carrito está vacío', 'advertencia');
            return;
        }

        try {
            // Crear orden
            const totalPagar = this.items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
            
            const pedido = {
                id_empresa: tiendaConfig.tiendaId,
                id_cliente: tiendaConfig.usuarioActual?.id || tiendaConfig.usuarioActual?.idCliente,
                items: this.items.map(item => ({
                    id_variante: item.id,
                    cantidad: item.qty || 1,
                    precio_unitario: item.price
                })),
                total: totalPagar,
                estado: 'Pendiente'
            };

            console.log('📦 Creando pedido:', pedido);

            const respuesta = await tiendaUtils.hacerPeticion(
                `${tiendaConfig.api.base}${tiendaConfig.api.pedidos}`,
                'POST',
                pedido
            );

            if (respuesta.id || respuesta.success) {
                // Limpiar carrito
                this.items = [];
                this.guardarCarrito();
                this.actualizarContador();
                
                // Cerrar modal
                document.getElementById('modalCarrito').style.display = 'none';
                
                tiendaUtils.notificacion('¡Pedido creado exitosamente!', 'exito');
                
                // Redireccionar a pago después de un tiempo
                setTimeout(() => {
                    // window.location.href = `pago.html?pedidoId=${respuesta.id}`;
                }, 1500);
            }
        } catch (error) {
            console.error('Error al crear pedido:', error);
            tiendaUtils.notificacion('Error al procesar el pedido', 'error');
        }
    },

    // Obtener total del carrito
    obtenerTotal() {
        return this.items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    carritoManager.inicializarCarrito();

    // Botón del carrito
    const btnCarrito = document.getElementById('btnCarrito');
    if (btnCarrito) {
        btnCarrito.addEventListener('click', () => {
            if (!tiendaConfig.estaAutenticado()) {
                tiendaUtils.notificacion('Debes iniciar sesión', 'info');
                authManager.abrirModal();
                return;
            }
            carritoManager.renderizarCarrito();
            document.getElementById('modalCarrito').style.display = 'block';
        });
    }

    // Botón proceder pago
    const btnProceder = document.getElementById('btnProcederPago');
    if (btnProceder) {
        btnProceder.addEventListener('click', () => {
            carritoManager.procederAlPago();
        });
    }

    // Modal cierre
    const modal = document.getElementById('modalCarrito');
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer click afuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Agregar al carrito desde modal de detalle
document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btnAgregarCarrito');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            if (window.productoActual) {
                const cantidad = parseInt(document.getElementById('cantidadInput').value) || 1;
                carritoManager.agregarAlCarrito(window.productoActual, cantidad);
                document.getElementById('modalProducto').style.display = 'none';
            }
        });
    }

    // Botones de cantidad en modal
    const btnMas = document.getElementById('btnMas');
    const btnMenos = document.getElementById('btnMenos');
    const input = document.getElementById('cantidadInput');

    if (btnMas) {
        btnMas.addEventListener('click', () => {
            input.value = Math.max(1, parseInt(input.value) + 1);
        });
    }

    if (btnMenos) {
        btnMenos.addEventListener('click', () => {
            input.value = Math.max(1, parseInt(input.value) - 1);
        });
    }
});
