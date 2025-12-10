// index_cliente.js - cargar datos de usuario en index_cliente.html
(function(){
    // Validar usuario logueado
    const s = localStorage.getItem('tapstyle_user');
    if (!s) {
        // desde pages/index_cliente.html, login está en ../login.html
        window.location.href = '../login.html';
        return;
    }

    const user = JSON.parse(s);
    const nombres = user.nombres || '';
    const apellidos = user.apellidos || '';
    const email = user.email || '';

    // Header
    const headerName = document.getElementById('header-username');
    if (headerName) headerName.textContent = `${nombres} ${apellidos}`;

    // Avatar initials
    const headerInitials = document.getElementById('header-initials');
    if (headerInitials) {
        const initials = ((nombres.split(' ')[0]||'').charAt(0) + (apellidos.split(' ')[0]||'').charAt(0)).toUpperCase();
        headerInitials.textContent = initials;
    }

    // Hero welcome
    const hero = document.getElementById('hero-welcome');
    if (hero) hero.textContent = `¡Bienvenido de nuevo, ${nombres}!`;

    // Trigger welcome toast
    if (window.showWelcome) window.showWelcome(user);
})();
