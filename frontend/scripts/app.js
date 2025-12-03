// js/app.js
$(document).ready(function () {
    
    const $ropaGrid = $('#ropa-semana-grid');
    const $accesoriosGrid = $('#accesorios-grid');

    // Función para crear la tarjeta HTML de un producto
    function createProductCard(product) {
        
        // 1. Crear los parámetros de la URL
        const urlParams = new URLSearchParams();
        urlParams.set('id', product.id);
        urlParams.set('name', product.name);
        urlParams.set('price', product.price);
        // Usamos una imagen más grande para la página de detalle
        urlParams.set('image', product.image.replace('400x500', '600x600')); 
        urlParams.set('store', product.store);
        urlParams.set('desc', product.description);
        urlParams.set('sizes', product.sizes.join(',')); // "S,M,L" o ""

        const detailUrl = `producto.html?${urlParams.toString()}`;

        // 2. Definir si la tarjeta debe estar oculta en vistas pequeñas
        // (Basado en tu HTML original, el 5to producto de cada fila se oculta)
        const hiddenClass = (product.id === 'p5' || product.id === 'a5') ? 'hidden xl:block' : '';

        // 3. Retornar el HTML de la tarjeta
        return `
            <a href="${detailUrl}" class="${hiddenClass} block bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300 group">
                <div class="relative overflow-hidden rounded-t-xl">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-500">
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">${product.name}</h3>
                    <p class="text-sm text-indigo-600 font-bold mt-1">S/ ${product.price.toFixed(2)}</p>
                    <p class="text-xs text-gray-500 mt-1">Por: ${product.store}</p>
                </div>
            </a>
        `;
    }

    // --- Función principal para cargar productos ---
    function loadProducts() {
        if (!window.PRODUCTS_DATA || !$ropaGrid.length || !$accesoriosGrid.length) {
            console.error("Faltan datos de productos o contenedores en el HTML.");
            return;
        }

        // Limpiar contenedores por si acaso
        $ropaGrid.empty();
        $accesoriosGrid.empty();

        // Iterar y agregar productos a sus grillas
        window.PRODUCTS_DATA.forEach(product => {
            const cardHtml = createProductCard(product);
            
            if (product.type === 'ropa') {
                $ropaGrid.append(cardHtml);
            } else if (product.type === 'accesorio') {
                $accesoriosGrid.append(cardHtml);
            }
        });
    }

    // Iniciar la carga de productos
    loadProducts();
});