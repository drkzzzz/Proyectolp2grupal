// login.js - moved from login.html
// Mostrar/ocultar pestañas
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const errorMessage = document.getElementById('error-message');

function showLogin() {
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    tabLogin.classList.add('border-indigo-600', 'text-indigo-600');
    tabLogin.classList.remove('border-transparent', 'text-gray-500');
    tabRegister.classList.remove('border-indigo-600', 'text-indigo-600');
    tabRegister.classList.add('border-transparent', 'text-gray-500');
    errorMessage.classList.add('hidden');
}

function showRegister() {
    formLogin.classList.add('hidden');
    formRegister.classList.remove('hidden');
    tabRegister.classList.add('border-indigo-600', 'text-indigo-600');
    tabRegister.classList.remove('border-transparent', 'text-gray-500');
    tabLogin.classList.remove('border-indigo-600', 'text-indigo-600');
    tabLogin.classList.add('border-transparent', 'text-gray-500');
    errorMessage.classList.add('hidden');
}

tabLogin.addEventListener('click', showLogin);
tabRegister.addEventListener('click', showRegister);

// Helpers para guardar estado en localStorage (compatibles con permisos.js)
function guardarLogin(authData) {
    try {
        if (authData && authData.usuario) {
            localStorage.setItem('tapstyle_user', JSON.stringify(authData.usuario));
            localStorage.setItem('tapstyle_role', authData.tipo || 'usuario');
            if (authData.permisos) {
                localStorage.setItem('user_permissions', JSON.stringify(Array.isArray(authData.permisos) ? authData.permisos : Array.from(authData.permisos)));
            }
            if (authData.token) localStorage.setItem('tapstyle_token', authData.token);
        }
    } catch (e) { console.warn('No se pudo guardar login en localStorage', e); }
}

// Mapeo simple de rutas por tipo
function rutaPorTipo(tipo) {
    tipo = (tipo || '').toLowerCase();
    if (tipo === 'superadmin') return '../admin/super-admin/dashboard_superadmin.html';
    if (tipo === 'admin' || tipo === 'admin_negocio' || tipo === 'admin-negocio') return '../admin/admin-negocio/dashboard_admin_negocio.html';
    if (tipo === 'vendedor') return '../admin/vendedor/dashboard_vendedor.html';
    // Por defecto cliente: index en la carpeta cliente
    return 'pages/index_cliente.html';
}

// Compute API base (use window config if present). Fallback to 127.0.0.1:8081
const _API_BASE = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : (window.API_BASE_URL || 'http://127.0.0.1:8081/api');

// Enviar login al backend
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('hidden');

    const username = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value;

    try {
        const res = await fetch(`${_API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const json = await res.json();
        if (res.ok && json.success) {
            const auth = json.data; // AuthResponse
            guardarLogin(auth);
            // Redirigir según tipo
            const destino = rutaPorTipo(auth.tipo);
            // If destination is client index, we want to navigate to pages/index_cliente.html from cliente folder
            window.location.href = destino;
        } else {
            console.error('Login fallido', json);
            errorMessage.textContent = (json && json.message) ? json.message : 'Credenciales incorrectas';
            errorMessage.classList.remove('hidden');
        }
    } catch (err) {
        console.error('Error en login', err);
        errorMessage.textContent = 'Error de conexión con el servidor';
        errorMessage.classList.remove('hidden');
    }
});

// Enviar registro al backend
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('hidden');

    const nombres = document.getElementById('nombres-register').value.trim();
    const apellidos = document.getElementById('apellidos-register').value.trim();
    const tipoDocumento = document.getElementById('tipo-documento').value;
    const numeroDocumento = document.getElementById('numero-documento').value.trim();
    const email = document.getElementById('email-register').value.trim();
    const celular = document.getElementById('telefono-register').value.trim();
    const direccion = document.getElementById('direccion-register').value.trim();
    const password = document.getElementById('password-register').value;
    const confirmPassword = document.getElementById('confirm-password-register').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Construir payload según UsuarioDTO esperado por backend
    const payload = {
        nombres,
        apellidos,
        numeroDocumento: numeroDocumento,
        celular: celular,
        direccion: direccion,
        username: email, // usar el email como username
        email: email,
        password: password,
        idRol: 5 // Cliente
    };

    try {
        const res = await fetch(`${_API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (res.ok && json.success) {
            alert('Registro exitoso. Puedes iniciar sesión ahora.');
            showLogin();
        } else {
            console.error('Registro fallido', json);
            alert('Error en registro: ' + (json && json.message ? json.message : 'Revisa los datos'));
        }
    } catch (err) {
        console.error('Error en registro', err);
        alert('Error de conexión con el servidor');
    }
});

// Inicializar mostrando el login
window.onload = showLogin;
