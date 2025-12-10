// welcome.js - mostrar mensaje de bienvenida
window.showWelcome = function(user) {
    try {
        let u = user;
        if (!u) {
            const s = localStorage.getItem('tapstyle_user');
            if (!s) return; // nada que mostrar
            u = JSON.parse(s);
        }

        const nombres = (u.nombres || '').trim();
        const apellidos = (u.apellidos || '').trim();
        const texto = `¡Bienvenido ${nombres} ${apellidos}!`;

        const toast = document.createElement('div');
        toast.className = 'welcome-toast';
        toast.innerHTML = `<div class="message">${texto}</div><button class="close-btn" aria-label="Cerrar">✕</button>`;

        document.body.appendChild(toast);

        const btn = toast.querySelector('.close-btn');
        const hide = () => {
            toast.classList.add('hidden');
            setTimeout(() => { try { toast.remove(); } catch(e){} }, 500);
        };

        btn.addEventListener('click', hide);

        // Auto-hide after 4s
        setTimeout(hide, 4000);
    } catch (e) {
        console.warn('showWelcome error', e);
    }
};

// También exposición para inicializar desde otros scripts
window.showWelcomeFromStorage = function() { window.showWelcome(); };
