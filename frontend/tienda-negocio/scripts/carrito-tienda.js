// ============================================
// carrito-tienda.js - Página de carrito COMPLETA
// ============================================

class CarritoTienda {
    constructor() {
        this.API_BASE = 'http://localhost:8083/api';
        this.usuario = null;
        this.carrito = [];
        this.tiendaId = this.obtenerIdTienda();
        
        // Elementos DOM
        this.elementos = {
            carritoVacio: document.getElementById('carritoVacio'),
            carritoLayout: document.getElementById('carritoLayout'),
            carritoItems: document.getElementById('carritoItems'),
            btnVaciarCarrito: document.getElementById('btnVaciarCarrito'),
            btnProcederPago: document.getElementById('btnProcederPago'),
            resumenSubtotal: document.getElementById('resumenSubtotal'),
            resumenIgv: document.getElementById('resumenIgv'),
            resumenTotal: document.getElementById('resumenTotal'),
            totalItems: document.getElementById('totalItems'),
            btnUsuario: document.getElementById('btnUsuario'),
            userDropdown: document.getElementById('userDropdown'),
            btnMiPerfil: document.getElementById('btnMiPerfil'),
            btnMisCompras: document.getElementById('btnMisCompras'),
            btnCerrarSesion: document.getElementById('btnCerrarSesion')
        };
        
        this.inicializar();
    }
    
    obtenerIdTienda() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('tienda_id')) || 122;
    }
    
    inicializar() {
        console.log('🛒 Inicializando página de carrito...');
        
        // IMPORTANTE: Limpiar carrito viejo incompatible para forzar datos frescos
        const carritoViejo = localStorage.getItem('carrito_tienda');
        if (carritoViejo) {
            try {
                const parsed = JSON.parse(carritoViejo);
                // Si tiene productos con IDs bajos (producto IDs), limpiar
                const tieneProductosInvalidos = parsed.some(item => {
                    const id = item.idProductoVariante || item.id;
                    return id < 1000;  // Product IDs son menores a 1000, variant IDs son >= 1000
                });
                
                if (tieneProductosInvalidos) {
                    console.warn('⚠️ Carrito contiene IDs de producto inválidos (< 1000), limpiando...');
                    localStorage.removeItem('carrito_tienda');
                    localStorage.removeItem('carrito_items');
                    alert('🔄 El carrito ha sido limpiado. Por favor, agregue productos nuevamente.');
                }
            } catch(e) {
                console.error('Error validando carrito:', e);
            }
        }
        
        // Verificar sesión
        this.verificarSesion();
        
        // Cargar carrito
        this.cargarCarrito();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Mostrar carrito
        this.mostrarCarrito();
    }
    
    verificarSesion() {
        const usuarioData = localStorage.getItem('tapstyle_user');
        
        if (usuarioData) {
            try {
                this.usuario = JSON.parse(usuarioData);
                console.log('✅ Usuario autenticado:', this.usuario.nombres);
                this.mostrarMenuUsuario();
            } catch (e) {
                console.log('❌ Error al parsear usuario');
                this.usuario = null;
            }
        }
    }
    
    mostrarMenuUsuario() {
        if (!this.elementos.btnUsuario) return;
        
        const nombreCompleto = `${this.usuario.nombres} ${this.usuario.apellidos}`.trim();
        this.elementos.btnUsuario.textContent = `👤 ${nombreCompleto}`;
        
        // Toggle dropdown
        this.elementos.btnUsuario.addEventListener('click', (e) => {
            e.stopPropagation();
            this.elementos.userDropdown.style.display = 
                this.elementos.userDropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        // Opciones
        if (this.elementos.btnMiPerfil) {
            this.elementos.btnMiPerfil.onclick = () => {
                window.location.href = '../../perfil_cliente.html';
            };
        }
        
        if (this.elementos.btnMisCompras) {
            this.elementos.btnMisCompras.onclick = () => {
                window.location.href = '../../mis-pedidos.html';
            };
        }
        
        if (this.elementos.btnCerrarSesion) {
            this.elementos.btnCerrarSesion.onclick = () => {
                localStorage.removeItem('tapstyle_user');
                localStorage.removeItem('tapstyle_token');
                localStorage.removeItem('tapstyle_role');
                location.reload();
            };
        }
    }
    
    // Limpiar carrito viejo y empezar fresco
    limpiarCarritoViejo() {
        console.log('🧹 Limpiando carrito viejo...');
        // Esto fuerza a que la próxima vez que se agregue algo, se use la integración correcta
        localStorage.removeItem('carrito_tienda');
        localStorage.removeItem('carrito_items');
        console.log('✅ Carrito viejo eliminado');
    }
    
    cargarCarrito() {
        console.log('📂 Cargando carrito desde localStorage...');
        
        // Intentar cargar desde carrito_items (antiguo)
        let data = localStorage.getItem('carrito_items');
        if (data) {
            this.carrito = JSON.parse(data);
            console.log('✅ Carrito cargado desde carrito_items (RAW):', JSON.stringify(this.carrito, null, 2));
            
            // Normalizar y validar IDs
            this.carrito = this.carrito.map((item, idx) => {
                console.log(`🔄 Normalizando item ${idx}:`, item);
                
                const idVariante = item.idProductoVariante || item.id;
                console.log(`   - ID variante detectado: ${idVariante} (source: ${item.idProductoVariante ? 'idProductoVariante' : 'id'})`);
                
                return {
                    id: idVariante,
                    idProductoVariante: idVariante,
                    nombreProducto: item.nombreProducto,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    imagen: item.imagen || '',
                    stock: item.stock || 0
                };
            });
            
            console.log('✅ Carrito normalizado:', this.carrito);
            return;
        }
        
        // Intentar cargar desde carrito_tienda (tienda pública)
        data = localStorage.getItem('carrito_tienda');
        if (data) {
            this.carrito = JSON.parse(data);
            console.log('✅ Carrito cargado desde carrito_tienda (RAW):', JSON.stringify(this.carrito, null, 2));
            
            // Normalizar y validar IDs
            this.carrito = this.carrito.map((item, idx) => {
                console.log(`🔄 Normalizando item ${idx}:`, item);
                
                const idVariante = item.idProductoVariante || item.id;
                console.log(`   - ID variante detectado: ${idVariante} (source: ${item.idProductoVariante ? 'idProductoVariante' : 'id'})`);
                
                return {
                    id: idVariante,
                    idProductoVariante: idVariante,
                    nombreProducto: item.nombreProducto,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    imagen: item.imagen || '',
                    stock: item.stock || 0
                };
            });
            
            console.log('✅ Carrito normalizado:', this.carrito);
            return;
        }
        
        console.log('ℹ️ No hay carrito guardado');
        this.carrito = [];
        
        // Carrito vacío
        this.carrito = [];
        console.log('ℹ️ Carrito vacío');
    }
    
    guardarCarrito() {
        localStorage.setItem('carrito_items', JSON.stringify(this.carrito));
        localStorage.setItem('carrito_tienda', JSON.stringify(this.carrito));
    }
    
    configurarEventos() {
        // Botón vaciar carrito
        if (this.elementos.btnVaciarCarrito) {
            this.elementos.btnVaciarCarrito.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                    this.carrito = [];
                    this.guardarCarrito();
                    this.mostrarCarrito();
                }
            });
        }
        
        // Botón proceder al pago
        if (this.elementos.btnProcederPago) {
            this.elementos.btnProcederPago.addEventListener('click', () => {
                this.procederPago();
            });
        }
        
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (this.elementos.userDropdown && 
                this.elementos.userDropdown.style.display !== 'none' &&
                !e.target.closest('#btnUsuario')) {
                this.elementos.userDropdown.style.display = 'none';
            }
        });
    }
    
    mostrarCarrito() {
        if (this.carrito.length === 0) {
            // Carrito vacío
            this.elementos.carritoVacio.style.display = 'block';
            this.elementos.carritoLayout.style.display = 'none';
            if (this.elementos.btnVaciarCarrito) {
                this.elementos.btnVaciarCarrito.style.display = 'none';
            }
            return;
        }
        
        // Carrito con items
        this.elementos.carritoVacio.style.display = 'none';
        this.elementos.carritoLayout.style.display = 'grid';
        if (this.elementos.btnVaciarCarrito) {
            this.elementos.btnVaciarCarrito.style.display = 'block';
        }
        
        // Renderizar items
        this.elementos.carritoItems.innerHTML = this.carrito.map((item, idx) => `
            <div class="carrito-item">
                <img src="${item.imagen || 'https://placehold.co/100x100'}" 
                     alt="${item.nombre}" 
                     class="item-imagen">
                
                <div class="item-info">
                    <h3>${item.nombre}</h3>
                    <p>Precio: S/. ${(item.precio || 0).toFixed(2)}</p>
                    ${item.stock !== undefined ? `<p class="stock-warning">Stock disponible: ${item.stock}</p>` : ''}
                </div>
                
                <div class="item-cantidad">
                    <button class="btn-cantidad" onclick="carritoTienda.disminuirCantidad(${idx})">−</button>
                    <input type="number" 
                           class="cantidad-input" 
                           value="${item.cantidad}" 
                           min="1" 
                           onchange="carritoTienda.actualizarCantidad(${idx}, this.value)">
                    <button class="btn-cantidad" onclick="carritoTienda.aumentarCantidad(${idx})">+</button>
                </div>
                
                <div class="item-precio">
                    S/. ${(item.precio || 0).toFixed(2)}
                </div>
                
                <div class="item-subtotal">
                    S/. ${(item.precio * item.cantidad).toFixed(2)}
                </div>
                
                <button class="btn-eliminar" onclick="carritoTienda.eliminarDelCarrito(${idx})">
                    🗑️ Eliminar
                </button>
            </div>
        `).join('');
        
        // Actualizar resumen
        this.actualizarResumen();
    }
    
    actualizarResumen() {
        const subtotal = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        
        if (this.elementos.resumenSubtotal) {
            this.elementos.resumenSubtotal.textContent = `S/. ${subtotal.toFixed(2)}`;
        }
        if (this.elementos.resumenIgv) {
            this.elementos.resumenIgv.textContent = `S/. ${igv.toFixed(2)}`;
        }
        if (this.elementos.resumenTotal) {
            this.elementos.resumenTotal.textContent = `S/. ${total.toFixed(2)}`;
        }
        if (this.elementos.totalItems) {
            this.elementos.totalItems.textContent = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
        }
    }
    
    aumentarCantidad(idx) {
        if (this.carrito[idx]) {
            this.carrito[idx].cantidad += 1;
            this.guardarCarrito();
            this.mostrarCarrito();
        }
    }
    
    disminuirCantidad(idx) {
        if (this.carrito[idx]) {
            if (this.carrito[idx].cantidad > 1) {
                this.carrito[idx].cantidad -= 1;
            } else {
                this.eliminarDelCarrito(idx);
                return;
            }
            this.guardarCarrito();
            this.mostrarCarrito();
        }
    }
    
    actualizarCantidad(idx, cantidad) {
        const cant = parseInt(cantidad);
        if (cant > 0 && this.carrito[idx]) {
            this.carrito[idx].cantidad = cant;
            this.guardarCarrito();
            this.mostrarCarrito();
        }
    }
    
    eliminarDelCarrito(idx) {
        if (confirm('¿Deseas eliminar este producto?')) {
            this.carrito.splice(idx, 1);
            this.guardarCarrito();
            this.mostrarCarrito();
        }
    }
    
    async procederPago() {
        // Validar sesión
        if (!this.usuario) {
            alert('⚠️ Debes iniciar sesión para comprar');
            window.location.href = '../../pages/cliente/login.html';
            return;
        }
        
        // Validar carrito
        if (this.carrito.length === 0) {
            alert('🛒 El carrito está vacío');
            return;
        }
        
        const subtotal = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        
        // Construir payload
        console.log('🔍 Carrito completo:', this.carrito);
        console.log('🔍 Verificando IDs de variantes...');
        
        const detalles = this.carrito.map(item => {
            console.log('📝 Item procesado:', {
                id: item.id,
                idProductoVariante: item.idProductoVariante,
                nombreProducto: item.nombreProducto,
                precio: item.precio
            });
            
            const idFinal = item.idProductoVariante || item.id;
            console.log(`✅ ID final para ${item.nombreProducto}: ${idFinal}`);
            
            return {
                idProductoVariante: idFinal,
                cantidad: item.cantidad,
                precioUnitario: item.precio
            };
        });
        
        const payload = {
            idUsuario: this.usuario.idUsuario || this.usuario.id_usuario,
            idEmpresa: this.tiendaId,
            detalles: detalles,
            montoPago: total,
            montoEnvio: 0,
            estado: 'Pendiente'
        };
        
        console.log('📦 Enviando pedido:', payload);
        
        try {
            const response = await fetch(`${this.API_BASE}/pedidos-clientes/checkout-carrito`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (data.success || (response.ok && data.data)) {
                const nroPedido = data.data?.idPedido || Math.floor(Math.random() * 100000);
                
                alert(`✅ ¡Compra realizada con éxito!\n\nNúmero de pedido: #${nroPedido}\n\nTotal: S/. ${total.toFixed(2)}`);
                
                // Vaciar carrito
                this.carrito = [];
                this.guardarCarrito();
                
                // Redirigir a mis pedidos
                setTimeout(() => {
                    window.location.href = '../../mis-pedidos.html';
                }, 2000);
            } else {
                alert('❌ Error al procesar la compra:\n' + (data.message || 'Intenta nuevamente'));
                console.error('Error response:', data);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al conectar con el servidor:\n' + error.message);
        }
    }
}

// ============================================
// INICIALIZACIÓN ANTIGUA (Compatibilidad)
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 Inicializando carrito-tienda.js...');
    window.carritoTienda = new CarritoTienda();
});

console.log('✅ carrito-tienda.js cargado');
