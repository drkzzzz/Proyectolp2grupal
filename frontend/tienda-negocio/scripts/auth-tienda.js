// Gestión de autenticación en la tienda
const authManager = {
    
    // Abrir modal de autenticación
    abrirModal() {
        document.getElementById('modalAuth').style.display = 'block';
        this.mostrarLogin();
    },

    // Mostrar formulario de login
    mostrarLogin() {
        const container = document.getElementById('authContainer');
        container.innerHTML = `
            <div class="auth-content">
                <h2>Inicia Sesión</h2>
                <p class="auth-subtitle">en ${tiendaConfig.nombreTienda}</p>
                
                <div id="error-message" class="error-message hidden" style="display: none;">
                    Credenciales incorrectas. Intenta con cliente@mail.com / 123456
                </div>
                
                <form id="formLogin">
                    <div class="form-group">
                        <label for="loginEmail">Email:</label>
                        <input type="email" id="loginEmail" required placeholder="tu@email.com">
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Contraseña:</label>
                        <input type="password" id="loginPassword" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-primary">Inicia Sesión</button>
                </form>
                <div class="auth-divider">o</div>
                <button id="btnMostrarRegistro" class="btn-secondary">Crear una Cuenta</button>
            </div>
        `;

        document.getElementById('formLogin').addEventListener('submit', (e) => {
            e.preventDefault();
            this.realizarLogin();
        });

        document.getElementById('btnMostrarRegistro').addEventListener('click', () => {
            this.mostrarRegistro();
        });
    },

    // Mostrar formulario de registro
    mostrarRegistro() {
        const container = document.getElementById('authContainer');
        container.innerHTML = `
            <div class="auth-content">
                <h2>Crear Cuenta</h2>
                <p class="auth-subtitle">para comprar en ${tiendaConfig.nombreTienda}</p>
                <form id="formRegistro">
                    <div class="form-group">
                        <label for="regNombre">Nombres:</label>
                        <input type="text" id="regNombre" required placeholder="Tu nombre">
                    </div>
                    <div class="form-group">
                        <label for="regApellido">Apellidos:</label>
                        <input type="text" id="regApellido" required placeholder="Tu apellido">
                    </div>
                    <div class="form-group">
                        <label for="regEmail">Email:</label>
                        <input type="email" id="regEmail" required placeholder="tu@email.com">
                    </div>
                    <div class="form-group">
                        <label for="regTelefono">Teléfono:</label>
                        <input type="tel" id="regTelefono" placeholder="987654321">
                    </div>
                    <div class="form-group">
                        <label for="regPassword">Contraseña:</label>
                        <input type="password" id="regPassword" required placeholder="••••••••" minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="regConfirm">Confirmar Contraseña:</label>
                        <input type="password" id="regConfirm" required placeholder="••••••••" minlength="6">
                    </div>
                    <button type="submit" class="btn-primary">Crear Cuenta</button>
                </form>
                <button id="btnMostrarLogin" class="btn-secondary">Ya tengo cuenta</button>
            </div>
        `;

        document.getElementById('formRegistro').addEventListener('submit', (e) => {
            e.preventDefault();
            this.realizarRegistro();
        });

        document.getElementById('btnMostrarLogin').addEventListener('click', () => {
            this.mostrarLogin();
        });
    },

    // Realizar login
    async realizarLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('error-message');

        if (!tiendaUtils.validarEmail(email)) {
            tiendaUtils.notificacion('Email inválido', 'error');
            return;
        }

        try {
            // Intentar login contra el API real
            const respuesta = await tiendaUtils.hacerPeticion(
                `${tiendaConfig.api.base}/auth/login`,
                'POST',
                {
                    email: email,
                    password: password
                }
            );

            if (respuesta.token && respuesta.usuario) {
                tiendaConfig.guardarSesion(respuesta.token, respuesta.usuario);
                document.getElementById('modalAuth').style.display = 'none';
                this.actualizarUIUsuario();
                tiendaUtils.notificacion('¡Bienvenido!', 'exito');
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
        } catch (error) {
            console.error('Error en login:', error);
            
            // Mock login para testing (cliente@mail.com / 123456)
            if (email === 'cliente@mail.com' && password === '123456') {
                const usuarioMock = {
                    id: 1,
                    idCliente: 1,
                    nombre: 'Cliente Prueba',
                    email: email,
                    telefono: '987654321'
                };
                tiendaConfig.guardarSesion('mock-token-' + Date.now(), usuarioMock);
                document.getElementById('modalAuth').style.display = 'none';
                this.actualizarUIUsuario();
                tiendaUtils.notificacion('¡Bienvenido! (Modo Demo)', 'exito');
            } else {
                if (errorEl) {
                    errorEl.style.display = 'block';
                }
                tiendaUtils.notificacion('Email o contraseña incorrectos', 'error');
            }
        }
    },

    // Realizar registro
    async realizarRegistro() {
        const nombre = document.getElementById('regNombre').value;
        const apellido = document.getElementById('regApellido').value;
        const email = document.getElementById('regEmail').value;
        const telefono = document.getElementById('regTelefono').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;

        if (password !== confirm) {
            tiendaUtils.notificacion('Las contraseñas no coinciden', 'error');
            return;
        }

        if (!tiendaUtils.validarEmail(email)) {
            tiendaUtils.notificacion('Email inválido', 'error');
            return;
        }

        try {
            const respuesta = await tiendaUtils.hacerPeticion(
                `${tiendaConfig.api.base}/clientes`,
                'POST',
                {
                    nombre: nombre,
                    apellido: apellido,
                    email: email,
                    telefono: telefono,
                    id_tipodocumento: 1
                }
            );

            if (respuesta.id || respuesta.id_cliente) {
                // Auto-login después del registro
                const usuarioMock = {
                    id: respuesta.id || respuesta.id_cliente,
                    idCliente: respuesta.id_cliente || respuesta.id,
                    nombre: nombre + ' ' + apellido,
                    email: email,
                    telefono: telefono
                };
                tiendaConfig.guardarSesion('token-' + Date.now(), usuarioMock);
                document.getElementById('modalAuth').style.display = 'none';
                this.actualizarUIUsuario();
                tiendaUtils.notificacion('¡Cuenta creada exitosamente!', 'exito');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            tiendaUtils.notificacion('Error al crear la cuenta', 'error');
        }
    },

    // Cerrar sesión
    cerrarSesion() {
        tiendaConfig.limpiarSesion();
        carritoManager.items = [];
        carritoManager.guardarCarrito();
        carritoManager.actualizarContador();
        this.actualizarUIUsuario();
        tiendaUtils.notificacion('Sesión cerrada', 'info');
    },

    // Actualizar UI del usuario
    actualizarUIUsuario() {
        const btnUsuario = document.getElementById('btnUsuario');
        const dropdown = document.getElementById('userDropdown');
        
        if (tiendaConfig.estaAutenticado()) {
            const nombre = tiendaConfig.usuarioActual?.nombre || tiendaConfig.usuarioActual?.nombres || 'Usuario';
            btnUsuario.textContent = `👤 ${nombre.split(' ')[0]}`;
        } else {
            btnUsuario.textContent = '👤 Iniciar Sesión';
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botón de usuario
    const btnUsuario = document.getElementById('btnUsuario');
    const dropdown = document.getElementById('userDropdown');

    if (btnUsuario) {
        btnUsuario.addEventListener('click', () => {
            if (!tiendaConfig.estaAutenticado()) {
                authManager.abrirModal();
            } else {
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Opciones del dropdown
    const btnMiPerfil = document.getElementById('btnMiPerfil');
    const btnMisCompras = document.getElementById('btnMisCompras');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    if (btnMiPerfil) {
        btnMiPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            tiendaUtils.notificacion('Función en desarrollo', 'info');
            dropdown.style.display = 'none';
        });
    }

    if (btnMisCompras) {
        btnMisCompras.addEventListener('click', (e) => {
            e.preventDefault();
            tiendaUtils.notificacion('Función en desarrollo', 'info');
            dropdown.style.display = 'none';
        });
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            authManager.cerrarSesion();
            dropdown.style.display = 'none';
        });
    }

    // Cerrar dropdown al hacer click afuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu') && dropdown) {
            dropdown.style.display = 'none';
        }
    });

    // Cerrar modal
    const modal = document.getElementById('modalAuth');
    const closeBtn = modal?.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer click afuera
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Actualizar UI
    authManager.actualizarUIUsuario();
});
