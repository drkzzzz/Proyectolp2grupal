// ================================================================
// Autenticación en la Tienda - Integrado con login global
// ================================================================

const AuthTienda = {
    API_BASE: 'http://127.0.0.1:8083/api',

    // Verificar si el usuario está logueado
    verificarSesion() {
        const usuario = localStorage.getItem('tapstyle_user');
        const btnUsuario = document.getElementById('btnUsuario');
        const userDropdown = document.getElementById('userDropdown');

        if (usuario) {
            const user = JSON.parse(usuario);
            btnUsuario.textContent = `👤 ${user.nombres || user.email}`;
            this.setupDropdownLogueado();
        } else {
            btnUsuario.textContent = '👤 Inicia Sesión';
            this.setupDropdownNoLogueado();
        }
    },

    // Setup para usuario logueado
    setupDropdownLogueado() {
        const btnMiPerfil = document.getElementById('btnMiPerfil');
        const btnMisCompras = document.getElementById('btnMisCompras');
        const btnCerrarSesion = document.getElementById('btnCerrarSesion');

        if (btnMiPerfil) {
            btnMiPerfil.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../../perfil_cliente.html';
            });
        }

        if (btnMisCompras) {
            btnMisCompras.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../../mis-pedidos.html';
            });
        }

        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', (e) => {
                e.preventDefault();
                this.cerrarSesion();
            });
        }
    },

    // Setup para usuario no logueado
    setupDropdownNoLogueado() {
        const btnMiPerfil = document.getElementById('btnMiPerfil');
        const btnMisCompras = document.getElementById('btnMisCompras');
        const btnCerrarSesion = document.getElementById('btnCerrarSesion');

        if (btnMiPerfil) {
            btnMiPerfil.textContent = 'Inicia Sesión';
            btnMiPerfil.addEventListener('click', (e) => {
                e.preventDefault();
                this.abrirLogin();
            });
        }

        if (btnMisCompras) {
            btnMisCompras.style.display = 'none';
        }

        if (btnCerrarSesion) {
            btnCerrarSesion.style.display = 'none';
        }
    },

    // Cerrar sesión
    cerrarSesion() {
        localStorage.removeItem('tapstyle_user');
        localStorage.removeItem('tapstyle_token');
        localStorage.removeItem('tapstyle_role');
        localStorage.removeItem('usuario_id');
        alert('✅ Sesión cerrada');
        window.location.reload();
    },

    // Abrir modal de login
    abrirLogin() {
        const modal = document.getElementById('modalAuth');
        if (modal) {
            modal.style.display = 'block';
            this.mostrarFormLogin();
        }
    },

    // Mostrar formulario de login
    mostrarFormLogin() {
        const container = document.getElementById('authContainer');
        container.innerHTML = `
            <div class="auth-content">
                <h2>Inicia Sesión</h2>
                <div id="error-message" style="display: none; color: #d32f2f; margin-bottom: 15px;"></div>
                <form id="formLogin">
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" id="loginEmail" required placeholder="tu@email.com">
                    </div>
                    <div class="form-group">
                        <label>Contraseña:</label>
                        <input type="password" id="loginPassword" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-primary">Inicia Sesión</button>
                </form>
                <div style="text-align: center; margin: 15px 0;">o</div>
                <button id="btnMostrarRegistro" class="btn-secondary" style="width: 100%;">Crear una Cuenta</button>
            </div>
        `;

        document.getElementById('formLogin').addEventListener('submit', (e) => {
            e.preventDefault();
            this.realizarLogin();
        });

        document.getElementById('btnMostrarRegistro').addEventListener('click', () => {
            this.mostrarFormRegistro();
        });
    },

    // Realizar login
    async realizarLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('error-message');

        try {
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const usuario = data.data.usuario || data.data;
                localStorage.setItem('tapstyle_user', JSON.stringify(usuario));
                localStorage.setItem('tapstyle_token', data.data.token || '');
                localStorage.setItem('tapstyle_role', usuario.nombreRol || 'Cliente');

                console.log('✅ Login exitoso');
                document.getElementById('modalAuth').style.display = 'none';
                this.verificarSesion();
                alert('✅ Bienvenido ' + (usuario.nombres || usuario.email));
                window.location.reload();
            } else {
                errorEl.style.display = 'block';
                errorEl.textContent = data.message || 'Credenciales incorrectas';
            }
        } catch (error) {
            console.error('Error:', error);
            errorEl.style.display = 'block';
            errorEl.textContent = 'Error de conexión';
        }
    },

    // Mostrar formulario de registro
    mostrarFormRegistro() {
        const container = document.getElementById('authContainer');
        container.innerHTML = `
            <div class="auth-content">
                <h2>Crear Cuenta</h2>
                <div id="error-message" style="display: none; color: #d32f2f; margin-bottom: 15px;"></div>
                <form id="formRegistro">
                    <div class="form-group">
                        <label>Nombres:</label>
                        <input type="text" id="regNombre" required placeholder="Tu nombre">
                    </div>
                    <div class="form-group">
                        <label>Apellidos:</label>
                        <input type="text" id="regApellido" required placeholder="Tu apellido">
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" id="regEmail" required placeholder="tu@email.com">
                    </div>
                    <div class="form-group">
                        <label>Teléfono:</label>
                        <input type="tel" id="regTelefono" placeholder="987654321">
                    </div>
                    <div class="form-group">
                        <label>Contraseña:</label>
                        <input type="password" id="regPassword" required placeholder="••••••••" minlength="4">
                    </div>
                    <button type="submit" class="btn-primary">Crear Cuenta</button>
                </form>
                <button id="btnMostrarLogin" class="btn-secondary" style="width: 100%; margin-top: 10px;">Volver al Login</button>
            </div>
        `;

        document.getElementById('formRegistro').addEventListener('submit', (e) => {
            e.preventDefault();
            this.realizarRegistro();
        });

        document.getElementById('btnMostrarLogin').addEventListener('click', () => {
            this.mostrarFormLogin();
        });
    },

    // Realizar registro
    async realizarRegistro() {
        const nombres = document.getElementById('regNombre').value.trim();
        const apellidos = document.getElementById('regApellido').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const telefono = document.getElementById('regTelefono').value.trim();
        const password = document.getElementById('regPassword').value;
        const errorEl = document.getElementById('error-message');

        try {
            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombres,
                    apellidos,
                    email,
                    username: email,
                    celular: telefono,
                    password,
                    idRol: 5 // Cliente
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('✅ Registro exitoso. Ahora inicia sesión.');
                document.getElementById('regEmail').value = email;
                document.getElementById('regPassword').value = '';
                this.mostrarFormLogin();
            } else {
                errorEl.style.display = 'block';
                errorEl.textContent = data.message || 'Error en el registro';
            }
        } catch (error) {
            console.error('Error:', error);
            errorEl.style.display = 'block';
            errorEl.textContent = 'Error de conexión';
        }
    }
};

// Inicializar autenticación
document.addEventListener('DOMContentLoaded', () => {
    AuthTienda.verificarSesion();

    // Toggle dropdown
    const btnUsuario = document.getElementById('btnUsuario');
    const userDropdown = document.getElementById('userDropdown');

    if (btnUsuario && userDropdown) {
        btnUsuario.addEventListener('click', (e) => {
            e.preventDefault();
            userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!btnUsuario.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.style.display = 'none';
            }
        });
    }
});
