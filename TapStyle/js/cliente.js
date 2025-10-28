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