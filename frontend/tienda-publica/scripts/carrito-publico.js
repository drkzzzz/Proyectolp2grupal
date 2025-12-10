// ============================================
// carrito-publico.js - Carrito para Tienda Pública
// ============================================

class CarritoPublico {
    constructor() {
        this.API_BASE = window.API_CONFIG?.BASE_URL || 'http://localhost:8083/api';
        this.idTienda = this.obtenerIdTienda();
        this.usuario = null;
        this.carrito = [];
        
        // Elementos DOM
        this.elementos = {
            btnCarrito: document.getElementById('btnCarrito'),
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
        console.log('🛒 Inicializando carrito público...');
        
        // Verificar sesión
        this.verificarSesion();
        
        // Cargar carrito desde localStorage
        this.cargarCarrito();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Mostrar contador de carrito
        this.actualizarContador();
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
                this.mostrarMenuLogin();
            }
        } else {
            console.log('ℹ️ Usuario no autenticado');
            this.mostrarMenuLogin();
        }
    }
    
    mostrarMenuUsuario() {
        if (!this.elementos.btnUsuario) return;
        
        const nombreCompleto = `${this.usuario.nombres} ${this.usuario.apellidos}`.trim();
        this.elementos.btnUsuario.textContent = `👤 ${nombreCompleto}`;
        this.elementos.btnUsuario.style.display = 'block';
        
        // Toggle del dropdown
        this.elementos.btnUsuario.addEventListener('click', (e) => {
            e.stopPropagation();
            this.elementos.userDropdown.style.display = 
                this.elementos.userDropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        // Opciones del menú
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
    
    mostrarMenuLogin() {
        if (!this.elementos.btnUsuario) return;
        
        this.elementos.btnUsuario.textContent = '👤 Inicia Sesión';
        this.elementos.btnUsuario.style.cursor = 'pointer';
        
        this.elementos.btnUsuario.addEventListener('click', () => {
            this.mostrarModalLogin();
        });
    }
    
    mostrarModalLogin() {
        const modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            ">
                <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">Iniciar Sesión</h2>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #555; font-weight: 500;">Email</label>
                    <input type="email" id="loginEmail" placeholder="tu@email.com" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        box-sizing: border-box;
                        font-size: 14px;
                    ">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; color: #555; font-weight: 500;">Contraseña</label>
                    <input type="password" id="loginPassword" placeholder="•••••••" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        box-sizing: border-box;
                        font-size: 14px;
                    ">
                </div>
                
                <button id="btnLogin" style="
                    width: 100%;
                    padding: 12px;
                    background: #3B82F6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-bottom: 10px;
                ">
                    Entrar
                </button>
                
                <p style="text-align: center; color: #666; margin-bottom: 0;">
                    ¿No tienes cuenta? <a href="#" id="irRegistro" style="color: #3B82F6; text-decoration: none;">Regístrate</a>
                </p>
                
                <button id="cerrarLogin" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('cerrarLogin').onclick = () => modal.remove();
        
        document.getElementById('btnLogin').onclick = () => this.procesarLogin(
            document.getElementById('loginEmail').value,
            document.getElementById('loginPassword').value,
            modal
        );
        
        document.getElementById('irRegistro').onclick = (e) => {
            e.preventDefault();
            modal.remove();
            this.mostrarModalRegistro();
        };
    }
    
    async procesarLogin(email, password, modal) {
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        try {
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success && data.data) {
                localStorage.setItem('tapstyle_user', JSON.stringify(data.data));
                localStorage.setItem('tapstyle_token', data.data.token || '');
                localStorage.setItem('tapstyle_role', data.data.rol || 'CLIENTE');
                
                modal.remove();
                alert('✅ Sesión iniciada correctamente');
                location.reload();
            } else {
                alert('❌ Email o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al conectar con el servidor');
        }
    }
    
    mostrarModalRegistro() {
        const modal = document.createElement('div');
        modal.id = 'registroModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            overflow-y: auto;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                margin: 20px 0;
            ">
                <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">Crear Cuenta</h2>
                
                <div style="margin-bottom: 12px;">
                    <input type="text" id="regNombres" placeholder="Nombres" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        box-sizing: border-box;
                        font-size: 14px;
                    ">
                </div>
                
                <div style="margin-bottom: 12px;">
                    <input type="text" id="regApellidos" placeholder="Apellidos" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        box-sizing: border-box;
                        font-size: 14px;
                    ">
                </div>
                
                <div style="margin-bottom: 12px;">
                    <input type="email" id="regEmail" placeholder="tu@email.com" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        box-sizing: border-box;
                        font-size: 14px;
                    ">
                </div>
                
                <div style="margin-bottom: 12px;">
                    <input type="text" id="regTelefono" placeholder="Teléfono" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        box-sizing: border-box;
                        font-size: 14px;
                    ">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <input type="password" id="regPassword" placeholder="Contraseña" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        box-sizing: border-box;
                        font-size: 14px;
                    ">
                </div>
                
                <button id="btnRegistro" style="
                    width: 100%;
                    padding: 12px;
                    background: #10B981;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-bottom: 10px;
                ">
                    Registrarse
                </button>
                
                <p style="text-align: center; color: #666; margin-bottom: 0;">
                    ¿Ya tienes cuenta? <a href="#" id="irLogin" style="color: #3B82F6; text-decoration: none;">Inicia Sesión</a>
                </p>
                
                <button id="cerrarRegistro" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('cerrarRegistro').onclick = () => modal.remove();
        
        document.getElementById('btnRegistro').onclick = () => this.procesarRegistro(
            document.getElementById('regNombres').value,
            document.getElementById('regApellidos').value,
            document.getElementById('regEmail').value,
            document.getElementById('regTelefono').value,
            document.getElementById('regPassword').value,
            modal
        );
        
        document.getElementById('irLogin').onclick = (e) => {
            e.preventDefault();
            modal.remove();
            this.mostrarModalLogin();
        };
    }
    
    async procesarRegistro(nombres, apellidos, email, telefono, password, modal) {
        if (!nombres || !apellidos || !email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        try {
            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombres,
                    apellidos,
                    email,
                    telefono: telefono || '',
                    password
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.data) {
                localStorage.setItem('tapstyle_user', JSON.stringify(data.data));
                localStorage.setItem('tapstyle_token', data.data.token || '');
                localStorage.setItem('tapstyle_role', data.data.rol || 'CLIENTE');
                
                modal.remove();
                alert('✅ Cuenta creada y sesión iniciada');
                location.reload();
            } else {
                alert('❌ Error al crear la cuenta: ' + (data.message || 'Intenta nuevamente'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al conectar con el servidor');
        }
    }
    
    cargarCarrito() {
        const data = localStorage.getItem('carrito_tienda');
        this.carrito = data ? JSON.parse(data) : [];
        console.log('🛒 Carrito cargado:', this.carrito);
    }
    
    configurarEventos() {
        if (this.elementos.btnCarrito) {
            this.elementos.btnCarrito.addEventListener('click', () => this.mostrarModalCarrito());
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
    
    actualizarContador() {
        const span = document.querySelector('#btnCarrito span') || 
                     document.querySelector('.btn-carrito span');
        if (span) {
            span.textContent = this.carrito.length;
        }
    }
    
    mostrarModalCarrito() {
        if (!this.usuario) {
            alert('⚠️ Debes iniciar sesión para comprar');
            this.mostrarModalLogin();
            return;
        }
        
        if (this.carrito.length === 0) {
            alert('🛒 El carrito está vacío');
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'modalCarrito';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            overflow-y: auto;
        `;
        
        const { subtotal, envio, total } = this.calcularTotales();
        
        let itemsHTML = this.carrito.map((item, idx) => `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                border-bottom: 1px solid #eee;
                background: #f9f9f9;
            ">
                <div style="flex: 1;">
                    <p style="margin: 0; font-weight: 500; color: #333;">${item.nombre}</p>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                        S/ ${(item.precio || 0).toFixed(2)} x 
                        <input type="number" min="1" value="${item.cantidad}" style="
                            width: 50px;
                            padding: 4px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                        " onchange="carritoPublico.actualizarCantidad(${idx}, this.value)">
                    </p>
                </div>
                <div style="text-align: right; margin-left: 10px;">
                    <p style="margin: 0; font-weight: 600; color: #3B82F6;">
                        S/ ${(item.precio * item.cantidad).toFixed(2)}
                    </p>
                    <button style="
                        background: #EF4444;
                        color: white;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        cursor: pointer;
                        margin-top: 5px;
                    " onclick="carritoPublico.eliminarDelCarrito(${idx})">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                max-height: 80vh;
                overflow-y: auto;
            ">
                <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">🛒 Mi Carrito</h2>
                
                <div style="
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    overflow: hidden;
                ">
                    ${itemsHTML}
                </div>
                
                <div style="
                    background: #f9f9f9;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #666;">Subtotal:</span>
                        <span style="font-weight: 600;">S/ ${subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #666;">Envío:</span>
                        <span style="font-weight: 600;">S/ ${envio.toFixed(2)}</span>
                    </div>
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        padding-top: 10px;
                        border-top: 2px solid #ddd;
                        font-size: 18px;
                        font-weight: 700;
                        color: #3B82F6;
                    ">
                        <span>Total:</span>
                        <span>S/ ${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <button id="btnProceder" style="
                    width: 100%;
                    padding: 14px;
                    background: #10B981;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 10px;
                ">
                    ✅ Proceder al Pago
                </button>
                
                <button id="btnCerrarCarrito" style="
                    width: 100%;
                    padding: 12px;
                    background: #E5E7EB;
                    color: #333;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                ">
                    Seguir Comprando
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('btnCerrarCarrito').onclick = () => modal.remove();
        
        document.getElementById('btnProceder').onclick = () => {
            modal.remove();
            this.procesarCompra();
        };
    }
    
    actualizarCantidad(idx, cantidad) {
        const cant = parseInt(cantidad);
        if (cant > 0) {
            this.carrito[idx].cantidad = cant;
            localStorage.setItem('carrito_tienda', JSON.stringify(this.carrito));
        }
    }
    
    eliminarDelCarrito(idx) {
        this.carrito.splice(idx, 1);
        localStorage.setItem('carrito_tienda', JSON.stringify(this.carrito));
        this.actualizarContador();
        this.mostrarModalCarrito();
    }
    
    calcularTotales() {
        const subtotal = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const envio = 50; // Envío fijo
        return {
            subtotal: subtotal,
            envio: envio,
            total: subtotal + envio
        };
    }
    
    async procesarCompra() {
        if (!this.usuario) {
            alert('⚠️ Debes iniciar sesión');
            return;
        }
        
        const { subtotal, envio, total } = this.calcularTotales();
        
        const payload = {
            idUsuario: this.usuario.idUsuario || this.usuario.id_usuario,
            idEmpresa: this.idTienda,
            detalles: this.carrito.map(item => ({
                idProductoVariante: item.id || item.idProductoVariante,
                cantidad: item.cantidad,
                precioUnitario: item.precio
            })),
            montoPago: total,
            montoEnvio: envio,
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
                alert('✅ ¡Compra realizada con éxito!\n\nNúmero de pedido: #' + (data.data?.idPedido || '12345'));
                
                // Vaciar carrito
                this.carrito = [];
                localStorage.removeItem('carrito_tienda');
                this.actualizarContador();
                
                // Redirigir a mis pedidos
                setTimeout(() => {
                    window.location.href = '../../mis-pedidos.html';
                }, 2000);
            } else {
                alert('❌ Error al procesar la compra: ' + (data.message || 'Intenta nuevamente'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al conectar con el servidor');
        }
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Inicializando carrito público...');
    window.carritoPublico = new CarritoPublico();
});

console.log('✅ carrito-publico.js cargado');
