// ==================================================
// FOOTER COMPONENT - CARGA DINÁMICA
// ==================================================

(function() {
    const footerHTML = `
    <!-- Footer TapStyle -->
    <footer class="bg-gray-900 text-gray-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                
                <!-- Sección TapStyle -->
                <div class="space-y-4">
                    <h3 class="text-white text-lg font-bold mb-4">TapStyle</h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="/frontend/pages/info.html?seccion=acerca-de-nosotros" class="hover:text-white transition duration-150">Acerca de Nosotros</a>
                        </li>
                        <li>
                            <a href="/frontend/pages/info.html?seccion=trabaja-con-nosotros" class="hover:text-white transition duration-150">Trabaja con Nosotros</a>
                        </li>
                        <li>
                            <a href="/frontend/pages/info.html?seccion=terminos-y-condiciones" class="hover:text-white transition duration-150">Términos y Condiciones</a>
                        </li>
                        <li>
                            <a href="/frontend/pages/info.html?seccion=politica-de-privacidad" class="hover:text-white transition duration-150">Política de Privacidad</a>
                        </li>
                    </ul>
                </div>

                <!-- Sección Ayuda -->
                <div class="space-y-4">
                    <h3 class="text-white text-lg font-bold mb-4">Ayuda</h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="/frontend/pages/info.html?seccion=faq" class="hover:text-white transition duration-150">FAQ</a>
                        </li>
                        <li>
                            <a href="/frontend/pages/info.html?seccion=politica-de-envios" class="hover:text-white transition duration-150">Política de Envíos</a>
                        </li>
                        <li>
                            <a href="/frontend/pages/info.html?seccion=metodos-de-pago" class="hover:text-white transition duration-150">Métodos de Pago</a>
                        </li>
                        <li>
                            <a href="https://wa.me/51918341898?text=Hola,%20necesito%20ayuda" target="_blank" class="hover:text-white transition duration-150">Contáctanos</a>
                        </li>
                    </ul>
                </div>

                <!-- Sección Contacto -->
                <div class="space-y-4">
                    <h3 class="text-white text-lg font-bold mb-4">Contacto</h3>
                    <ul class="space-y-2">
                        <li class="flex items-center">
                            <span class="mr-2">📍</span>
                            <span>Tarapoto, San Martín - Perú</span>
                        </li>
                        <li class="flex items-center">
                            <span class="mr-2">📞</span>
                            <a href="https://wa.me/51918341898" target="_blank" class="hover:text-white transition duration-150">+51 918 341 898</a>
                        </li>
                        <li class="flex items-center">
                            <span class="mr-2">✉️</span>
                            <a href="mailto:soporte@tapstyle.com" class="hover:text-white transition duration-150">soporte@tapstyle.com</a>
                        </li>
                    </ul>
                </div>

                <!-- Sección Síguenos -->
                <div class="space-y-4">
                    <h3 class="text-white text-lg font-bold mb-4">Síguenos</h3>
                    <div class="flex space-x-4">
                        <a href="https://www.facebook.com/tapstyle" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition duration-150" aria-label="Facebook">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/tapstyle" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition duration-150" aria-label="Instagram">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                        <a href="https://wa.me/51918341898" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition duration-150" aria-label="WhatsApp">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                        </a>
                    </div>
                    <div class="mt-6">
                        <p class="text-sm text-gray-400 mb-3">¿Tienes alguna duda?</p>
                        <div class="relative">
                            <form class="flex" onsubmit="handleSearch(event)">
                                <input type="text" 
                                       id="search-input" 
                                       placeholder="Buscar información..." 
                                       class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-indigo-500 text-sm"
                                       oninput="handleSearchInput(event)"
                                       autocomplete="off">
                                <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-r-lg transition duration-150 text-sm font-medium">
                                    🔍
                                </button>
                            </form>
                            <!-- Resultados de búsqueda -->
                            <div id="search-results" class="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto hidden z-50">
                                <!-- Los resultados se insertan aquí dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Separador -->
            <div class="border-t border-gray-800 pt-8">
                <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p class="text-sm text-gray-400">
                        © 2025 TapStyle S.A. Todos los derechos reservados.
                    </p>
                    <div class="flex space-x-6 text-sm">
                        <a href="https://wa.me/51918341898?text=Quiero%20presentar%20un%20reclamo" target="_blank" class="text-gray-400 hover:text-white transition duration-150">Libro de Reclamaciones</a>
                        <a href="/frontend/pages/info.html?seccion=faq" class="text-gray-400 hover:text-white transition duration-150">Mapa del Sitio</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `;

    // Función para cargar el footer
    function loadFooter() {
        const container = document.getElementById('footer-container');
        if (container) {
            container.innerHTML = footerHTML;
        }
    }

    // Base de conocimiento con contenido indexado
    const contenidoBusqueda = [
        { seccion: 'acerca-de-nosotros', titulo: 'Acerca de Nosotros', keywords: ['plataforma', 'suscripciones', 'tiendas', 'tarapoto', 'ropa', 'accesorios', 'digitalizar', 'emprendedores', 'tecnología', 'inventario', 'pagos', 'envíos'], texto: 'TapStyle es una plataforma de suscripciones con sede en Tarapoto que permite a tiendas de ropa y accesorios tener su propia tienda virtual' },
        { seccion: 'trabaja-con-nosotros', titulo: 'Trabaja con Nosotros', keywords: ['trabajo', 'empleo', 'vacantes', 'desarrolladores', 'full stack', 'onboarding', 'soporte', 'marketing', 'diseño', 'producto', 'cv', 'carrera'], texto: 'Únete a nuestro equipo en Tarapoto. Buscamos desarrolladores, especialistas en onboarding, soporte técnico, marketing y diseño UX/UI' },
        { seccion: 'terminos-y-condiciones', titulo: 'Términos y Condiciones', keywords: ['términos', 'condiciones', 'legal', 'contrato', 'usuario', 'vendedor', 'cuenta', 'responsabilidad', 'pagos', 'suscripción'], texto: 'Términos legales de uso de la plataforma TapStyle, cuentas de usuario, transacciones y responsabilidades' },
        { seccion: 'politica-de-privacidad', titulo: 'Política de Privacidad', keywords: ['privacidad', 'datos', 'personales', 'protección', 'información', 'cookies', 'seguridad', 'derechos', 'gdpr'], texto: 'Cómo recopilamos, usamos y protegemos tus datos personales. Tus derechos sobre la información' },
        { seccion: 'faq', titulo: 'Preguntas Frecuentes', keywords: ['preguntas', 'dudas', 'ayuda', 'pedido', 'comprar', 'pago', 'envío', 'cuenta', 'tienda', 'seguro', 'atención', 'cliente'], texto: 'Respuestas a las preguntas más frecuentes sobre compras, pagos, envíos y cómo abrir tu tienda' },
        { seccion: 'politica-de-envios', titulo: 'Política de Envíos', keywords: ['envío', 'envíos', 'delivery', 'entrega', 'courier', 'tiempo', 'costo', 'seguimiento', 'tracking', 'tarapoto', 'provincia', 'gratis', 'olva', 'shalom'], texto: 'Tiempos de envío: Tarapoto 1-2 días, Región San Martín 3-5 días. Seguimiento con código. Envío gratis en compras mayores a S/.100' },
        { seccion: 'metodos-de-pago', titulo: 'Métodos de Pago', keywords: ['pago', 'tarjeta', 'visa', 'mastercard', 'yape', 'plin', 'paypal', 'transferencia', 'efectivo', 'seguro', 'ssl', 'contra entrega'], texto: 'Aceptamos tarjetas, billeteras digitales (Yape, Plin), transferencias bancarias y pago contra entrega. Pagos 100% seguros' },
        // FAQ específicas
        { seccion: 'faq', titulo: '¿Cómo hacer un pedido?', keywords: ['hacer pedido', 'comprar', 'carrito', 'checkout', 'cuenta'], texto: 'Navega por las tiendas, agrega productos al carrito y procede al checkout. Necesitas crear una cuenta' },
        { seccion: 'faq', titulo: '¿Métodos de pago?', keywords: ['forma de pago', 'cómo pagar', 'tarjetas'], texto: 'Aceptamos Visa, Mastercard, transferencias y billeteras digitales' },
        { seccion: 'faq', titulo: '¿Cuánto tarda el envío?', keywords: ['tiempo envío', 'cuánto demora', 'cuándo llega'], texto: 'Lima 2-4 días hábiles, provincia 5-7 días hábiles' },
        { seccion: 'faq', titulo: '¿Puedo devolver?', keywords: ['devolver', 'devolución', 'cambio', 'reembolso'], texto: 'No manejamos devoluciones. Verifica las descripciones antes de comprar' },
        { seccion: 'faq', titulo: '¿Cómo abrir mi tienda?', keywords: ['vender', 'crear tienda', 'suscripción', 'vendedor', 'abrir negocio'], texto: 'Contáctanos por WhatsApp al 918 341 898 para conocer los planes de suscripción' },
        { seccion: 'faq', titulo: '¿Es seguro comprar?', keywords: ['seguro', 'confiable', 'protección', 'fraude'], texto: 'Sí, usamos encriptación SSL y verificamos a todos los vendedores' },
        { seccion: 'faq', titulo: 'Atención al cliente', keywords: ['contacto', 'soporte', 'ayuda', 'whatsapp', 'email', 'chat'], texto: 'WhatsApp: 918 341 898, Email: soporte@tapstyle.com' }
    ];

    // Función de búsqueda inteligente
    function buscarContenido(query) {
        if (!query || query.length < 2) return [];
        
        const queryLower = query.toLowerCase().trim();
        const palabras = queryLower.split(' ').filter(p => p.length > 2);
        
        return contenidoBusqueda.map(item => {
            let score = 0;
            
            // Coincidencia exacta en título (peso alto)
            if (item.titulo.toLowerCase().includes(queryLower)) {
                score += 100;
            }
            
            // Coincidencia en keywords (peso medio)
            item.keywords.forEach(keyword => {
                if (keyword.includes(queryLower) || queryLower.includes(keyword)) {
                    score += 50;
                }
                palabras.forEach(palabra => {
                    if (keyword.includes(palabra)) {
                        score += 20;
                    }
                });
            });
            
            // Coincidencia en texto (peso bajo)
            if (item.texto.toLowerCase().includes(queryLower)) {
                score += 30;
            }
            palabras.forEach(palabra => {
                if (item.texto.toLowerCase().includes(palabra)) {
                    score += 10;
                }
            });
            
            return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Top 5 resultados
    }

    // Mostrar resultados de búsqueda
    function mostrarResultados(resultados) {
        const container = document.getElementById('search-results');
        
        if (resultados.length === 0) {
            container.innerHTML = `
                <div class="p-4 text-center text-gray-400">
                    <p class="text-sm">No se encontraron resultados</p>
                    <p class="text-xs mt-2">Intenta con otras palabras clave</p>
                </div>
            `;
            container.classList.remove('hidden');
            return;
        }
        
        container.innerHTML = resultados.map(item => `
            <a href="/frontend/pages/info.html?seccion=${item.seccion}" 
               class="block p-4 hover:bg-gray-700 transition duration-150 border-b border-gray-700 last:border-b-0">
                <div class="flex items-start">
                    <span class="text-indigo-400 mr-2">📄</span>
                    <div class="flex-1">
                        <h4 class="text-white font-semibold text-sm mb-1">${item.titulo}</h4>
                        <p class="text-gray-400 text-xs line-clamp-2">${item.texto}</p>
                    </div>
                    <span class="text-gray-500 text-xs ml-2">→</span>
                </div>
            </a>
        `).join('');
        
        container.classList.remove('hidden');
    }

    // Handler de input (búsqueda en tiempo real)
    window.handleSearchInput = function(event) {
        const query = event.target.value;
        
        if (query.length < 2) {
            document.getElementById('search-results').classList.add('hidden');
            return;
        }
        
        const resultados = buscarContenido(query);
        mostrarResultados(resultados);
    };

    // Handler de submit (búsqueda al presionar Enter)
    window.handleSearch = function(event) {
        event.preventDefault();
        const query = document.getElementById('search-input').value;
        
        if (query.length < 2) {
            alert('Por favor, ingresa al menos 2 caracteres para buscar');
            return;
        }
        
        const resultados = buscarContenido(query);
        
        if (resultados.length > 0) {
            // Navegar al primer resultado
            window.location.href = `/frontend/pages/info.html?seccion=${resultados[0].seccion}`;
        } else {
            mostrarResultados([]);
        }
    };

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', function(event) {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        if (searchInput && searchResults && 
            !searchInput.contains(event.target) && 
            !searchResults.contains(event.target)) {
            searchResults.classList.add('hidden');
        }
    });

    // Cargar footer cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }
})();
