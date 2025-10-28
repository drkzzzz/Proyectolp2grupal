// Script para manejar submenús colapsables
document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.submenu-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const container = this.parentElement;
            const submenu = container.querySelector('.submenu');
            const icon = this.querySelector('.submenu-icon');
            
            // Cerrar otros submenús
            document.querySelectorAll('.submenu').forEach(sm => {
                if (sm !== submenu) {
                    sm.classList.add('hidden');
                    sm.parentElement.querySelector('.submenu-icon').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle actual
            submenu.classList.toggle('hidden');
            icon.style.transform = submenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });
    
    // Marcar página activa
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('bg-indigo-600', 'text-white');
            link.classList.remove('text-gray-300', 'text-gray-400');
            
            // Abrir submenú si está dentro de uno
            const submenu = link.closest('.submenu');
            if (submenu) {
                submenu.classList.remove('hidden');
                submenu.parentElement.querySelector('.submenu-icon').style.transform = 'rotate(180deg)';
            }
        }
    });
});
