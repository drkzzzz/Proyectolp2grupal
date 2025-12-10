// login.js - Funcional con BD real
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

// Guardar datos de sesión
function guardarSesion(usuario, token) {
    try {
        localStorage.setItem('tapstyle_user', JSON.stringify(usuario));
        localStorage.setItem('tapstyle_token', token || '');
        localStorage.setItem('tapstyle_role', usuario.nombreRol || 'Cliente');
        localStorage.setItem('usuario_id', usuario.idUsuario || '');
    } catch (e) {
        console.warn('No se pudo guardar sesión', e);
    }
}

function rutaPorRol(rol) {
    const rolLower = (rol || '').toLowerCase();
    if (rolLower === 'superadmin') return '../admin/super-admin/dashboard_superadmin.html';
    if (rolLower === 'admin') return '../admin/admin-negocio/dashboard_admin_negocio.html';
    if (rolLower === 'vendedor') return '../admin/vendedor/dashboard_vendedor.html';
    return 'index.html'; // Cliente - retorna a la página principal con sesión
}

const API_BASE = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'http://127.0.0.1:8083/api';

// LOGIN
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('hidden');

    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value;

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: email,  // El backend espera username
                password: password 
            })
        });

        console.log('Status:', res.status);
        const json = await res.json();
        console.log('Response:', json);

        if (res.ok && json.success && json.data) {
            const authData = json.data;
            const usuario = authData.usuario || authData;
            
            // Guardar sesión
            guardarSesion(usuario, authData.token || '');
            
            // Redirigir según rol
            const destino = rutaPorRol(authData.tipo || usuario.nombreRol);
            window.location.href = destino;
        } else {
            const msg = json.message || 'Credenciales incorrectas';
            errorMessage.textContent = msg;
            errorMessage.classList.remove('hidden');
        }
    } catch (err) {
        console.error('Error:', err);
        errorMessage.textContent = 'Error de conexión. Verifica que el servidor esté en 8083';
        errorMessage.classList.remove('hidden');
    }
});

// REGISTRO
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('hidden');

    const nombres = document.getElementById('nombres-register').value.trim();
    const apellidos = document.getElementById('apellidos-register').value.trim();
    const tipoDocumento = parseInt(document.getElementById('tipo-documento').value);
    const numeroDocumento = document.getElementById('numero-documento').value.trim();
    const email = document.getElementById('email-register').value.trim();
    const telefono = document.getElementById('telefono-register').value.trim();
    const direccion = document.getElementById('direccion-register').value.trim();
    const password = document.getElementById('password-register').value;
    const confirmPassword = document.getElementById('confirm-password-register').value;

    if (!email || !password || !nombres || !apellidos) {
        alert('Completa los campos obligatorios');
        return;
    }

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 4) {
        alert('La contraseña debe tener al menos 4 caracteres');
        return;
    }

    // Payload para backend - UsuarioDTO
    const payload = {
        nombres,
        apellidos,
        numeroDocumento,
        idTipoDocumento: tipoDocumento,
        celular: telefono,
        email,
        username: email, // Usar email como username
        password,
        idRol: 5, // Cliente por defecto
        idEmpresa: null // Cliente no tiene empresa
    };

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Register Status:', res.status);
        const json = await res.json();
        console.log('Register Response:', json);

        if (res.ok && json.success) {
            alert('✅ Registro exitoso. Ahora inicia sesión con tus credenciales.');
            // Limpiar formulario
            formRegister.reset();
            showLogin();
            // Completar email en login
            document.getElementById('email-login').value = email;
            document.getElementById('password-login').focus();
        } else {
            const msg = json.message || 'Error en el registro';
            alert('❌ ' + msg);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error de conexión. Verifica que el servidor esté en 8083');
    }
});

// Inicializar mostrando login
window.onload = showLogin;
