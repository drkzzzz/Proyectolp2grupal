/**
 * CARRITO SIMPLE - Versión minimalista
 * Simplicidad: Agregar al carrito > Ir a carrito > Pagar
 * Sin integraciones complejas, sin validaciones múltiples
 */

class CarritoSimple {
    constructor() {
        this.API_BASE = 'http://localhost:8083/api';
        this.STORAGE_KEY = 'carrito_simple';
        this.usuario = null;
        this.carrito = [];
        
        // Elementos del HTML
        this.elementos = {
            lista: document.getElementById('carritoItems'),
            total: document.getElementById('resumenTotal'),
            subtotal: document.getElementById('resumenSubtotal'),
            igv: document.getElementById('resumenIgv'),
            btnVaciar: document.getElementById('btnVaciarCarrito'),
            btnPagar: document.getElementById('btnProcederPago'),
            mensaje: document.getElementById('carritoVacio'),
        };
        
        this.init();
    }
    
    init() {
        console.log('🛒 Iniciando carrito simple...');
        this.usuario = this.getUsuario();
        this.cargar();
        this.render();
        this.eventos();
    }
    
    // Obtener usuario de localStorage
    getUsuario() {
        const datos = localStorage.getItem('tapstyle_user');
        return datos ? JSON.parse(datos) : null;
    }
    
    // Cargar desde localStorage
    cargar() {
        const datos = localStorage.getItem(this.STORAGE_KEY);
        this.carrito = datos ? JSON.parse(datos) : [];
        console.log(`📦 Carrito cargado: ${this.carrito.length} items`);
    }
    
    // Guardar a localStorage
    guardar() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.carrito));
        console.log('💾 Carrito guardado');
    }
    
    // Agregar producto (llamado desde tienda.html)
    agregar(idVariante, nombre, precio, imagen) {
        // Buscar si ya existe
        let item = this.carrito.find(x => x.idVariante === idVariante);
        
        if (item) {
            item.cantidad++;
            console.log(`📝 Aumentada cantidad de ${nombre}`);
        } else {
            this.carrito.push({
                idVariante,
                nombre,
                precio: parseFloat(precio),
                imagen,
                cantidad: 1
            });
            console.log(`➕ Agregado: ${nombre}`);
        }
        
        this.guardar();
        this.render();
        alert(`✅ ${nombre} agregado al carrito`);
    }
    
    // Eliminar producto
    eliminar(idVariante) {
        this.carrito = this.carrito.filter(x => x.idVariante !== idVariante);
        this.guardar();
        this.render();
    }
    
    // Cambiar cantidad
    cambiarCantidad(idVariante, cantidad) {
        const item = this.carrito.find(x => x.idVariante === idVariante);
        if (item) {
            item.cantidad = Math.max(1, parseInt(cantidad));
            this.guardar();
            this.render();
        }
    }
    
    // Vaciar carrito
    vaciar() {
        if (confirm('¿Vaciar carrito?')) {
            this.carrito = [];
            this.guardar();
            this.render();
        }
    }
    
    // Calcular totales
    calcularTotales() {
        const subtotal = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const igv = subtotal * 0.18; // 18% en Perú
        const total = subtotal + igv;
        
        return { subtotal, igv, total };
    }
    
    // Renderizar carrito
    render() {
        // Mostrar/ocultar mensaje vacío
        const vacio = this.carrito.length === 0;
        if (this.elementos.mensaje) {
            this.elementos.mensaje.style.display = vacio ? 'block' : 'none';
        }
        
        // Limpiar lista
        if (this.elementos.lista) {
            this.elementos.lista.innerHTML = '';
            
            // Agregar items
            this.carrito.forEach(item => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>
                        <img src="${item.imagen}" alt="${item.nombre}" style="width:50px; height:50px; border-radius:5px;">
                    </td>
                    <td>${item.nombre}</td>
                    <td>S/. ${item.precio.toFixed(2)}</td>
                    <td>
                        <input type="number" min="1" value="${item.cantidad}" 
                            onchange="carrito.cambiarCantidad(${item.idVariante}, this.value)"
                            style="width:60px; padding:5px;">
                    </td>
                    <td>S/. ${(item.precio * item.cantidad).toFixed(2)}</td>
                    <td>
                        <button onclick="carrito.eliminar(${item.idVariante})" 
                            class="btn btn-sm btn-danger">🗑️ Eliminar</button>
                    </td>
                `;
                this.elementos.lista.appendChild(fila);
            });
        }
        
        // Actualizar totales
        const { subtotal, igv, total } = this.calcularTotales();
        if (this.elementos.subtotal) this.elementos.subtotal.textContent = `S/. ${subtotal.toFixed(2)}`;
        if (this.elementos.igv) this.elementos.igv.textContent = `S/. ${igv.toFixed(2)}`;
        if (this.elementos.total) this.elementos.total.textContent = `S/. ${total.toFixed(2)}`;
        
        // Habilitar/deshabilitar botones
        if (this.elementos.btnVaciar) {
            this.elementos.btnVaciar.disabled = vacio;
        }
        if (this.elementos.btnPagar) {
            this.elementos.btnPagar.disabled = vacio || !this.usuario;
        }
    }
    
    // Proceder al pago
    async pagar() {
        if (!this.usuario) {
            alert('❌ Debes iniciar sesión');
            return;
        }
        
        if (this.carrito.length === 0) {
            alert('❌ Carrito vacío');
            return;
        }
        
        try {
            console.log('📤 Enviando pedido...');
            
            const { subtotal, igv, total } = this.calcularTotales();
            
            // Construir payload (compatible con backend)
            const request = {
                idUsuario: this.usuario.id_usuario,
                idEmpresa: this.usuario.id_empresa || 122,
                detalles: this.carrito.map(item => ({
                    idProductoVariante: item.idVariante,
                    cantidad: item.cantidad,
                    precioUnitario: item.precio
                })),
                subtotal,
                igv,
                montoPago: total,
                montoEnvio: 0
            };
            
            console.log('📦 Payload:', JSON.stringify(request, null, 2));
            
            const res = await fetch(`${this.API_BASE}/pedidos-clientes/checkout-carrito`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            
            const data = await res.json();
            
            if (data.success || (data.data && data.data.id)) {
                console.log('✅ Pedido creado:', data.data);
                alert(`✅ ¡Compra realizada!\nNúmero de pedido: ${data.data.numeroPedido || data.data.id}`);
                
                // Limpiar carrito
                this.carrito = [];
                this.guardar();
                
                // Redirigir a mis pedidos
                setTimeout(() => {
                    window.location.href = '../../mis-pedidos.html';
                }, 1500);
            } else {
                console.error('❌ Error en respuesta:', data);
                alert(`❌ Error: ${data.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('❌ Error al procesar pago:', error);
            alert(`❌ Error: ${error.message}`);
        }
    }
    
    // Configurar eventos
    eventos() {
        if (this.elementos.btnVaciar) {
            this.elementos.btnVaciar.addEventListener('click', () => this.vaciar());
        }
        if (this.elementos.btnPagar) {
            this.elementos.btnPagar.addEventListener('click', () => this.pagar());
        }
    }
}

// Instancia global
let carrito;
document.addEventListener('DOMContentLoaded', () => {
    carrito = new CarritoSimple();
});
