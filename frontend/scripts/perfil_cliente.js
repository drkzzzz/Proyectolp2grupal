// perfil_cliente.js - rellenar formulario de perfil con tapstyle_user
(function(){
    const s = localStorage.getItem('tapstyle_user');
    if (!s) {
        window.location.href = '../login.html';
        return;
    }
    const user = JSON.parse(s);

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') el.value = val || '';
        else el.textContent = val || '';
    };

    setVal('perfil-nombres', user.nombres || '');
    setVal('perfil-apellidos', user.apellidos || '');
    setVal('perfil-email', user.email || '');
    setVal('perfil-telefono', user.celular || '');
    setVal('perfil-direccion', user.direccion || '');

    // Header (iniciales y nombre)
    try {
        const headerName = document.getElementById('header-username');
        if (headerName) headerName.textContent = `${user.nombres || ''} ${user.apellidos || ''}`.trim();
        const headerInitials = document.getElementById('header-initials');
        if (headerInitials) {
            const initials = ((user.nombres||'').split(' ')[0].charAt(0) || '') + ((user.apellidos||'').split(' ')[0].charAt(0) || '');
            headerInitials.textContent = initials.toUpperCase();
        }
    } catch(e){}

    // Si existe numero de documento en user
    if (user.numeroDocumento) {
        // intentar encontrar un campo con name o id relacionado
        const possible = document.querySelector('input[name="numero_documento"], input#numero_documento, input#perfil-numero-documento');
        if (possible) possible.value = user.numeroDocumento;
    }

    // Helper para mostrar mensajes
    const msgEl = document.getElementById('perfil-msg');
    function showMessage(type, text) {
        if (!msgEl) return;
        msgEl.textContent = text;
        msgEl.className = '';
        if (type === 'success') msgEl.classList.add('text-green-600');
        else if (type === 'error') msgEl.classList.add('text-red-600');
        else msgEl.classList.add('text-gray-700');
    }

    // Submit handler: PUT /api/usuarios/{id}
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async function(e){
        e.preventDefault();
        showMessage('', '');

        const nombres = (document.getElementById('perfil-nombres')||{}).value || '';
        const apellidos = (document.getElementById('perfil-apellidos')||{}).value || '';
        const telefono = (document.getElementById('perfil-telefono')||{}).value || '';
        const direccion = (document.getElementById('perfil-direccion')||{}).value || '';

        // Validar telefono: debe contener solo dígitos (mín 6, máx 15)
        const onlyDigits = /^\d{6,15}$/.test(telefono.replace(/\s+/g, ''));
        if (telefono && !onlyDigits) {
            showMessage('error', 'El teléfono debe contener sólo dígitos (6-15 caracteres).');
            return;
        }

        const saveBtn = document.getElementById('perfil-guardar-btn');
        if (saveBtn) saveBtn.disabled = true;

        // base URL fallback
        // Prefer global API_BASE_URL, then window.API_BASE_URL, otherwise fallback to backend address
        const base = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : (window.API_BASE_URL || 'http://127.0.0.1:8081/api');

        // Identificador usuario
        const id = user.idUsuario || user.id || user.id_usuario;
        if (!id) {
            showMessage('error', 'No se encontró el identificador de usuario. Vuelva a iniciar sesión.');
            if (saveBtn) saveBtn.disabled = false;
            return;
        }

        const token = localStorage.getItem('tapstyle_token');
        if (!token) {
            window.location.href = '../login.html';
            return;
        }

        // Construir payload limpio según UsuarioDTO esperado por backend
        const payload = {
            idUsuario: Number(id),
            idEmpresa: user.idEmpresa || null,
            idRol: user.idRol || user.idRol || null,
            nombres: nombres,
            apellidos: apellidos,
            numeroDocumento: user.numeroDocumento || null,
            celular: telefono || null,
            direccion: direccion || null,
            username: user.username || user.email || null,
            email: user.email || user.username || null,
            // no enviar password aquí a menos que se quiera cambiar
            estado: (typeof user.estado !== 'undefined') ? user.estado : true
        };

        try {
            const res = await fetch(`${base}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                    let errText = 'Error al actualizar perfil.';
                    try {
                        const body = await res.json();
                        console.debug('Profile update failed, server response:', body);
                        if (body) {
                            if (body.message) errText = body.message;
                            else if (body.error) errText = body.error;
                            else if (body.errors) errText = JSON.stringify(body.errors);
                        }
                    } catch(e){ console.debug('No JSON body in profile update failure', e); }
                    showMessage('error', errText);
                    return;
            }

            // intentar leer respuesta JSON
            let data = null;
            try { data = await res.json(); } catch(e) { data = null; }

            // Preferir usuario devuelto por API si existe
            let updatedUser = null;
            if (data) {
                if (data.usuario) updatedUser = data.usuario;
                else if (data.data && data.data.usuario) updatedUser = data.data.usuario;
                else if (data.idUsuario || data.id) updatedUser = data;
            }
            if (!updatedUser) updatedUser = payload;

            localStorage.setItem('tapstyle_user', JSON.stringify(updatedUser));
            showMessage('success', 'Perfil actualizado correctamente.');

            // actualizar header
            try {
                const headerName = document.getElementById('header-username');
                if (headerName) headerName.textContent = `${updatedUser.nombres || ''} ${updatedUser.apellidos || ''}`.trim();
                const headerInitials = document.getElementById('header-initials');
                if (headerInitials) {
                    const initials = ((updatedUser.nombres||'').split(' ')[0].charAt(0) || '') + ((updatedUser.apellidos||'').split(' ')[0].charAt(0) || '');
                    headerInitials.textContent = initials.toUpperCase();
                }
            } catch(e){}

        } catch(err) {
            showMessage('error', 'No se pudo conectar con el servidor.');
        } finally {
            if (saveBtn) saveBtn.disabled = false;
        }
    });
})();

// Password modal logic (two-step)
(function(){
    const modal = document.getElementById('password-modal');
    if (!modal) return;

    const step1 = document.getElementById('pw-step-1');
    const step2 = document.getElementById('pw-step-2');
    const currentInput = document.getElementById('pw-current');
    const validateBtn = document.getElementById('pw-validate-btn');
    const cancel1 = document.getElementById('pw-cancel-1');
    const step1Msg = document.getElementById('pw-step1-msg');
    const newInput = document.getElementById('pw-new');
    const confirmInput = document.getElementById('pw-confirm');
    const changeBtn = document.getElementById('pw-change-btn');
    const backBtn = document.getElementById('pw-back-btn');
    const step2Msg = document.getElementById('pw-step2-msg');
    const openBtn = document.getElementById('open-password-modal');

    function showModal(){
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.style.display = 'flex';
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
        step1Msg.textContent = '';
        step2Msg.textContent = '';
        currentInput.value = '';
        newInput.value = '';
        confirmInput.value = '';
    }
    function closeModal(){
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.style.display = 'none';
    }

    openBtn && openBtn.addEventListener('click', function(e){ e.preventDefault(); showModal(); });
    cancel1 && cancel1.addEventListener('click', function(e){ e.preventDefault(); closeModal(); });
    backBtn && backBtn.addEventListener('click', function(e){ e.preventDefault(); step1.classList.remove('hidden'); step2.classList.add('hidden'); step2Msg.textContent = ''; });

    // Validate current password by calling /api/auth/login (without storing token)
    validateBtn && validateBtn.addEventListener('click', async function(e){
        e.preventDefault();
        step1Msg.textContent = '';
        const pwd = currentInput.value || '';
        if (!pwd) { step1Msg.textContent = 'Ingrese la contraseña actual.'; return; }

        const base = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : (window.API_BASE_URL || 'http://127.0.0.1:8081/api');
        const stored = (function(){ try { return JSON.parse(localStorage.getItem('tapstyle_user')||'{}'); } catch(e){ return {}; } })();
        const username = stored.username || stored.email || '';
        const email = stored.email || stored.username || '';
        if (!email && !username) { step1Msg.textContent = 'No se encontró el usuario. Vuelva a iniciar sesión.'; return; }

        try {
            // Send only the expected shape: { username, password }
            // Prefer username; if missing, use email in the username field (API accepts username or email there)
            const loginBody = { username: username || email, password: pwd };
            console.debug('Validating current password with body:', loginBody);
            const res = await fetch(`${base}/auth/login`, {
                method: 'POST', headers: {'Content-Type':'application/json'},
                body: JSON.stringify(loginBody)
            });
            if (!res.ok) {
                // Try to read server error message for better feedback
                try {
                    const err = await res.json();
                    console.debug('Login validation failed, server response:', err);
                    if (err && err.message) step1Msg.textContent = err.message;
                    else step1Msg.textContent = 'Contraseña incorrecta.';
                } catch (e) {
                    step1Msg.textContent = 'Contraseña incorrecta.';
                }
                return;
            }
            // success -> proceed to step 2
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            step1Msg.textContent = '';
        } catch(err){
            step1Msg.textContent = 'Error al conectar con el servidor.';
        }
    });

    // Change password
    changeBtn && changeBtn.addEventListener('click', async function(e){
        e.preventDefault();
        step2Msg.textContent = '';
        const np = (newInput.value||'').trim();
        const cp = (confirmInput.value||'').trim();
        if (np.length < 6) { step2Msg.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }
        if (np !== cp) { step2Msg.textContent = 'Las contraseñas no coinciden.'; return; }

        const userS = localStorage.getItem('tapstyle_user');
        if (!userS) { step2Msg.textContent = 'Sesión expirada. Vuelva a iniciar sesión.'; return; }
        const user = JSON.parse(userS);
        const id = user.idUsuario || user.id || user.id_usuario;
        if (!id) { step2Msg.textContent = 'No se encontró el identificador de usuario.'; return; }

        const base = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : (window.API_BASE_URL || 'http://127.0.0.1:8081/api');
        const token = localStorage.getItem('tapstyle_token');
        if (!token) { step2Msg.textContent = 'Sesión expirada. Vuelva a iniciar sesión.'; return; }

        // Send only the password field to update password (API updates contraseñaHash when password provided)
        const payload = { password: np };
        try {
            const res = await fetch(`${base}/usuarios/${id}`, {
                method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                let txt = 'Error al actualizar la contraseña.';
                try { const b = await res.json(); console.debug('Password change failed:', b); if (b && b.message) txt = b.message; } catch(e){ console.debug('No JSON body on password change failure', e); }
                step2Msg.textContent = txt;
                return;
            }

            // success
            step2Msg.textContent = '';
            closeModal();
            alert('Contraseña actualizada correctamente.');
        } catch(err){
            step2Msg.textContent = 'No se pudo conectar con el servidor.';
        }
    });

    // Click outside modal to close
    modal.addEventListener('click', function(e){
        if (e.target === modal) closeModal();
    });
})();
