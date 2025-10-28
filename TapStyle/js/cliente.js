// js/cliente.js

$(document).ready(function () {
    
    // 1. Apuntamos al contenedor de productos en 'index_cliente.html'
    const $recomendadosGrid = $('#recomendados-grid');

    // 2. Función para crear las tarjetas de producto (con el nuevo diseño de favoritos y estrellas)
    function createProductCard(product) {
        
        // Crear URL para la página de detalle (esto es igual que en app.js)
        const urlParams = new URLSearchParams();
        urlParams.set('id', product.id);
        urlParams.set('name', product.name);
        urlParams.set('price', product.price);
        urlParams.set('image', product.image.replace('400x500', '600x600'));
        urlParams.set('store', product.store);
        urlParams.set('desc', product.description);
        urlParams.set('sizes', product.sizes.join(',')); // Convertimos el array ['S','M'] a un string "S,M"

        const detailUrl = `producto.html?${urlParams.toString()}`;
                        
        // HTML de la tarjeta (basado en tu nuevo diseño)
        return `
        <a href="${detailUrl}" class="block bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 group">
            <div class="relative overflow-hidden rounded-t-xl">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover group-hover:scale-105 transition duration-500">
                
                <button class="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-red-500 hover:text-white transition duration-150" 
                        onclick="event.preventDefault(); alert('Funcionalidad \\'Favoritos\\' pendiente.');">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 truncate">${product.name}</h3>
                <p class="text-sm text-indigo-600 font-bold mt-1">S/ ${product.price.toFixed(2)}</p>
                <p class="text-xs text-gray-500 mt-1">Por: ${product.store}</p>
                
                <div class="flex items-center mt-2">
                    <div class="flex text-yellow-400">
                        ★★★★☆ 
                    </div>
                    <span class="text-xs text-gray-500 ml-1">(${(Math.floor(Math.random() * 100) + 20)})</span>
                </div>
            </div>
        </a>
        `;
    }

    // 3. Función para cargar los productos en la grilla (MODIFICADA)
    function loadRecommendedProducts() {
        if (!window.PRODUCTS_DATA || !$recomendadosGrid.length) {
            console.error("Faltan datos de productos (products.js) o el contenedor #recomendados-grid.");
            return;
        }

        $recomendadosGrid.empty(); // Limpiar el contenedor

        // --- LÍNEA MODIFICADA ---
        // Filtramos solo los productos marcados como 'recomendado'
        const recommended = window.PRODUCTS_DATA.filter(product => product.type === 'recomendado');

        recommended.forEach((product, index) => {
            const cardHtml = createProductCard(product);
            const $card = $(cardHtml); // Convertir a objeto jQuery

            // Si es el 5to ítem (índice 4), le añadimos la clase especial de tu HTML
            if (index === 4) {
                $card.addClass('hidden xl:block');
            }
            
            $recomendadosGrid.append($card);
        });
    }

    // 4. Iniciar la carga
    loadRecommendedProducts();
});

// js/cliente.js

$(document).ready(function () {
    
    // ===========================================
    // CONFIGURACIÓN Y VARIABLES GLOBALES
    // ===========================================
    const CART_KEY = "tapstyle_cart";
    const FAVORITOS_KEY = "tapstyle_favoritos";
    const PEDIDOS_KEY = "tapstyle_pedidos";

    // 1. Apuntamos al contenedor de productos en 'index_cliente.html'
    const $recomendadosGrid = $('#recomendados-grid');
    const $favoritosGrid = $('#favoritos-grid');

    // ===========================================
    // FUNCIONALIDAD DEL CARRITO
    // ===========================================
    
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cart = getCart();
        const count = cart.reduce((s, i) => s + (i.qty || 0), 0);
        $('.cart-count').text(count);
    }

    function showToast(msg, type = 'success') {
        let t = document.getElementById("toast");
        if (!t) {
            t = document.createElement("div");
            t.id = "toast";
            t.className = "fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg opacity-0 transform translate-y-4 transition-all z-50";
            document.body.appendChild(t);
        }
        
        const bgColor = type === 'success' ? 'bg-green-600' : type === 'info' ? 'bg-blue-600' : 'bg-red-600';
        t.className = `fixed bottom-6 right-6 ${bgColor} text-white px-4 py-2 rounded shadow-lg opacity-0 transform translate-y-4 transition-all z-50`;
        
        t.textContent = msg;
        t.style.opacity = "1";
        t.style.transform = "translateY(0)";
        setTimeout(() => {
            t.style.opacity = "0";
            t.style.transform = "translateY(12px)";
        }, 1800);
    }

    // ===========================================
    // FUNCIONALIDAD DE FAVORITOS
    // ===========================================
    
    function getFavoritos() {
        try {
            return JSON.parse(localStorage.getItem(FAVORITOS_KEY) || "[]");
        } catch {
            return [];
        }
    }

    function saveFavoritos(favoritos) {
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
        updateFavoritosCount();
        // Si estamos en la página de favoritos, actualizar la lista
        if (window.location.pathname.includes('favoritos_cliente.html')) {
            loadFavoritos();
        }
    }

    function toggleFavorito(product) {
        const favoritos = getFavoritos();
        const existingIndex = favoritos.findIndex(fav => fav.id === product.id);
        
        if (existingIndex > -1) {
            // Remover de favoritos
            favoritos.splice(existingIndex, 1);
            saveFavoritos(favoritos);
            showToast("Producto removido de favoritos", 'info');
            return false;
        } else {
            // Agregar a favoritos
            favoritos.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                store: product.store,
                description: product.description,
                sizes: product.sizes,
                type: product.type,
                addedAt: new Date().toISOString()
            });
            saveFavoritos(favoritos);
            showToast("Producto añadido a favoritos");
            return true;
        }
    }

    function isFavorito(productId) {
        const favoritos = getFavoritos();
        return favoritos.some(fav => fav.id === productId);
    }

    function updateFavoritosCount() {
        const favoritos = getFavoritos();
        const count = favoritos.length;
        $('.favoritos-count').text(count);
    }

    function createFavoritoCard(product) {
        const urlParams = new URLSearchParams();
        urlParams.set('id', product.id);
        urlParams.set('name', product.name);
        urlParams.set('price', product.price);
        urlParams.set('image', product.image.replace('400x500', '600x600'));
        urlParams.set('store', product.store);
        urlParams.set('desc', product.description);
        urlParams.set('sizes', product.sizes.join(','));

        const detailUrl = `producto.html?${urlParams.toString()}`;

        return `
        <div class="block bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 group">
            <div class="relative overflow-hidden rounded-t-xl">
                <a href="${detailUrl}">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover group-hover:scale-105 transition duration-500">
                </a>
                
                <button class="favorito-btn absolute top-2 right-2 p-2 bg-red-500 bg-opacity-20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition duration-150" 
                        data-product-id="${product.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            <div class="p-4">
                <a href="${detailUrl}">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">${product.name}</h3>
                    <p class="text-sm text-indigo-600 font-bold mt-1">S/ ${product.price.toFixed(2)}</p>
                    <p class="text-xs text-gray-500 mt-1">Por: ${product.store}</p>
                </a>
                
                <div class="flex items-center mt-2">
                    <div class="flex text-yellow-400">
                        ★★★★☆ 
                    </div>
                    <span class="text-xs text-gray-500 ml-1">(${(Math.floor(Math.random() * 100) + 20)})</span>
                </div>
            </div>
        </div>
        `;
    }

    function loadFavoritos() {
        if (!$favoritosGrid.length) return;

        const favoritos = getFavoritos();
        $favoritosGrid.empty();

        if (favoritos.length === 0) {
            $favoritosGrid.html(`
                <div class="col-span-full text-center py-12">
                    <div class="text-4xl mb-4">❤️</div>
                    <p class="text-gray-500 text-lg">No tienes productos en favoritos</p>
                    <p class="text-gray-400 text-sm mt-2">Agrega productos a favoritos para verlos aquí</p>
                    <a href="index_cliente.html" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150">
                        Explorar productos
                    </a>
                </div>
            `);
            return;
        }

        favoritos.forEach(product => {
            const cardHtml = createFavoritoCard(product);
            $favoritosGrid.append(cardHtml);
        });

        // Agregar event listeners para los botones de favoritos
        $favoritosGrid.find('.favorito-btn').on('click', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            const product = favoritos.find(p => p.id === productId);
            
            if (product) {
                toggleFavorito(product);
                // Recargar la lista de favoritos
                loadFavoritos();
            }
        });
    }

    // ===========================================
    // FUNCIONALIDAD DE PEDIDOS
    // ===========================================
    
    function getPedidos() {
        try {
            // Si no hay pedidos, crear algunos de ejemplo basados en los datos de index_cliente.html
            let pedidos = JSON.parse(localStorage.getItem(PEDIDOS_KEY) || "[]");
            
            if (pedidos.length === 0) {
                // Crear pedidos de ejemplo basados en los datos mostrados en index_cliente.html
                pedidos = [
                    {
                        id: 'TS-4056',
                        fecha: '2024-10-15T00:00:00.000Z',
                        productos: [
                            {
                                name: 'Hoodie Verde Urban',
                                price: 79.00,
                                image: 'https://placehold.co/50x50/4ADE80/000000?text=HV',
                                qty: 1,
                                size: 'M',
                                color: 'Verde'
                            }
                        ],
                        total: 79.00,
                        estado: 'entregado',
                        direccion: 'Av. Principal 123, Lima',
                        metodoPago: 'Tarjeta de Crédito'
                    },
                    {
                        id: 'TS-4055',
                        fecha: '2024-10-12T00:00:00.000Z',
                        productos: [
                            {
                                name: 'Jeans Classic Fit',
                                price: 65.00,
                                image: 'https://placehold.co/50x50/60A5FA/000000?text=JC',
                                qty: 1,
                                size: '32',
                                color: 'Azul'
                            },
                            {
                                name: 'Camiseta Básica',
                                price: 35.00,
                                image: 'https://placehold.co/50x50/F59E0B/000000?text=CG',
                                qty: 2,
                                size: 'L',
                                color: 'Blanco'
                            }
                        ],
                        total: 135.00,
                        estado: 'en_camino',
                        direccion: 'Calle Secundaria 456, Lima',
                        metodoPago: 'Tarjeta de Débito'
                    },
                    {
                        id: 'TS-4050',
                        fecha: '2024-10-08T00:00:00.000Z',
                        productos: [
                            {
                                name: 'Reloj Deportivo',
                                price: 120.00,
                                image: 'https://placehold.co/50x50/8B5CF6/000000?text=AC',
                                qty: 1
                            }
                        ],
                        total: 120.00,
                        estado: 'completado',
                        direccion: 'Jr. Los Olivos 789, Lima',
                        metodoPago: 'Transferencia Bancaria'
                    }
                ];
                savePedidos(pedidos);
            }
            
            return pedidos;
        } catch {
            return [];
        }
    }

    function savePedidos(pedidos) {
        localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
    }

    function crearPedido(cart, infoPago) {
        const pedidos = getPedidos();
        const nuevoPedido = {
            id: 'TS-' + Date.now(),
            fecha: new Date().toISOString(),
            productos: [...cart],
            total: infoPago.total,
            estado: 'pendiente', // Cambiado a pendiente para mostrar los diferentes estados
            direccion: infoPago.direccion,
            metodoPago: infoPago.metodoPago
        };
        
        pedidos.unshift(nuevoPedido);
        savePedidos(pedidos);
        return nuevoPedido;
    }

    function getEstadoInfo(estado) {
        const estados = {
            'pendiente': { class: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
            'en_camino': { class: 'bg-blue-100 text-blue-800', text: 'En camino' },
            'entregado': { class: 'bg-green-100 text-green-800', text: 'Entregado' },
            'completado': { class: 'bg-gray-100 text-gray-800', text: 'Completado' },
            'confirmado': { class: 'bg-purple-100 text-purple-800', text: 'Confirmado' }
        };
        return estados[estado] || estados['pendiente'];
    }

    function formatFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    function loadPedidos() {
        const $listaPedidos = $('#lista-pedidos');
        if (!$listaPedidos.length) return;

        const pedidos = getPedidos();
        $listaPedidos.empty();

        if (pedidos.length === 0) {
            $listaPedidos.html(`
                <div class="p-8 text-center">
                    <div class="text-4xl mb-4">📦</div>
                    <p class="text-gray-500 text-lg">No tienes pedidos recientes</p>
                    <p class="text-gray-400 text-sm mt-2">Realiza tu primera compra para ver tus pedidos aquí</p>
                    <a href="index_cliente.html" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150">
                        Comprar ahora
                    </a>
                </div>
            `);
            return;
        }

        pedidos.forEach(pedido => {
            const estadoInfo = getEstadoInfo(pedido.estado);
            const pedidoHtml = `
                <div class="p-6 hover:bg-gray-50 transition duration-150">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <p class="font-semibold text-gray-900">${pedido.id}</p>
                            <p class="text-sm text-gray-500">Realizado: ${formatFecha(pedido.fecha)}</p>
                        </div>
                        <span class="${estadoInfo.class} text-xs font-medium px-2 py-1 rounded-full">${estadoInfo.text}</span>
                    </div>
                    <div class="space-y-3">
                        ${pedido.productos.map(producto => `
                            <div class="flex items-center space-x-3">
                                <img src="${producto.image}" alt="${producto.name}" class="w-12 h-12 rounded-lg object-cover">
                                <div class="flex-1">
                                    <p class="font-medium text-gray-800 text-sm">${producto.name}</p>
                                    <p class="text-xs text-gray-500">Cantidad: ${producto.qty}</p>
                                    ${producto.size ? `<p class="text-xs text-gray-500">Talla: ${producto.size}</p>` : ''}
                                    ${producto.color ? `<p class="text-xs text-gray-500">Color: ${producto.color}</p>` : ''}
                                </div>
                                <span class="text-sm font-semibold text-gray-900">S/ ${(producto.price * producto.qty).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <div class="flex justify-between items-center">
                            <p class="text-sm font-semibold text-gray-900">Total: S/ ${pedido.total.toFixed(2)}</p>
                            <button class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
            $listaPedidos.append(pedidoHtml);
        });
    }

    // ===========================================
    // FUNCIONALIDAD DE PRODUCTOS RECOMENDADOS
    // ===========================================
    
    function createProductCard(product) {
        const urlParams = new URLSearchParams();
        urlParams.set('id', product.id);
        urlParams.set('name', product.name);
        urlParams.set('price', product.price);
        urlParams.set('image', product.image.replace('400x500', '600x600'));
        urlParams.set('store', product.store);
        urlParams.set('desc', product.description);
        urlParams.set('sizes', product.sizes.join(','));

        const detailUrl = `producto.html?${urlParams.toString()}`;
        
        const esFavorito = isFavorito(product.id);
        const colorCorazon = esFavorito ? 'text-red-500' : 'text-gray-400';
        const bgCorazon = esFavorito ? 'bg-red-500 bg-opacity-20' : 'bg-white bg-opacity-80';
                        
        return `
        <div class="block bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 group">
            <div class="relative overflow-hidden rounded-t-xl">
                <a href="${detailUrl}">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover group-hover:scale-105 transition duration-500">
                </a>
                
                <button class="favorito-btn absolute top-2 right-2 p-2 ${bgCorazon} ${colorCorazon} rounded-full hover:bg-red-500 hover:text-white transition duration-150" 
                        data-product-id="${product.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="${esFavorito ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            <div class="p-4">
                <a href="${detailUrl}">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">${product.name}</h3>
                    <p class="text-sm text-indigo-600 font-bold mt-1">S/ ${product.price.toFixed(2)}</p>
                    <p class="text-xs text-gray-500 mt-1">Por: ${product.store}</p>
                </a>
                
                <div class="flex items-center mt-2">
                    <div class="flex text-yellow-400">
                        ★★★★☆ 
                    </div>
                    <span class="text-xs text-gray-500 ml-1">(${(Math.floor(Math.random() * 100) + 20)})</span>
                </div>
            </div>
        </div>
        `;
    }

    function loadRecommendedProducts() {
        if (!window.PRODUCTS_DATA || !$recomendadosGrid.length) {
            console.error("Faltan datos de productos (products.js) o el contenedor #recomendados-grid.");
            return;
        }

        $recomendadosGrid.empty();

        const recommended = window.PRODUCTS_DATA.filter(product => product.type === 'recomendado');

        recommended.forEach((product, index) => {
            const cardHtml = createProductCard(product);
            const $card = $(cardHtml);

            if (index === 4) {
                $card.addClass('hidden xl:block');
            }
            
            $recomendadosGrid.append($card);
        });

        // Agregar event listeners para los botones de favoritos
        $('.favorito-btn').on('click', function(e) {
            e.preventDefault();
            const productId = $(this).data('product-id');
            const product = window.PRODUCTS_DATA.find(p => p.id === productId);
            
            if (product) {
                const esFavorito = toggleFavorito(product);
                const $btn = $(this);
                const $svg = $btn.find('svg');
                
                if (esFavorito) {
                    $btn.removeClass('bg-white bg-opacity-80 text-gray-400').addClass('bg-red-500 bg-opacity-20 text-red-500');
                    $svg.attr('fill', 'currentColor');
                } else {
                    $btn.removeClass('bg-red-500 bg-opacity-20 text-red-500').addClass('bg-white bg-opacity-80 text-gray-400');
                    $svg.attr('fill', 'none');
                }
            }
        });
    }

    // ===========================================
    // INICIALIZACIÓN
    // ===========================================
    
    function init() {
        updateCartCount();
        updateFavoritosCount();
        
        // Cargar contenido específico según la página
        if (window.location.pathname.includes('index_cliente.html') || window.location.pathname === '/') {
            loadRecommendedProducts();
        } else if (window.location.pathname.includes('favoritos_cliente.html')) {
            loadFavoritos();
        } else if (window.location.pathname.includes('pedidos_cliente.html')) {
            loadPedidos();
        }
    }

    // Iniciar la aplicación
    init();
});