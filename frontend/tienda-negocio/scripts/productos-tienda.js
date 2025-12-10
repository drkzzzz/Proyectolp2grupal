// Gestión de productos en la tienda
const productosManager = {
    
    productos: [],
    productosFiltrados: [],

    // Cargar productos de la tienda
    async cargarProductos() {
        try {
            const tiendaId = tiendaConfig.tiendaId;
            if (!tiendaId) {
                console.error('No hay tiendaId');
                return;
            }

            console.log('📦 Cargando productos de tienda:', tiendaId);

            // Llamar al API para obtener productos de esta tienda
            const response = await tiendaUtils.hacerPeticion(
                `${tiendaConfig.api.base}${tiendaConfig.api.productos}/empresa/${tiendaId}`
            );
            
            // Extraer datos correctamente de ApiResponse { success, message, data, error }
            if (response && response.data && Array.isArray(response.data)) {
                this.productos = response.data;
            } else if (Array.isArray(response)) {
                this.productos = response;
            } else {
                this.productos = [];
            }

            console.log('✅ Productos cargados:', this.productos.length);
            
            // Mapear campos si vienen del API (idProducto -> id, nombreProducto -> nombre, etc)
            this.productos = this.productos.map(p => ({
                id: p.idProducto || p.id,
                nombre: p.nombreProducto || p.nombre,
                descripcion: p.descripcion || '',
                precio: p.precio || 0,
                imagen: p.imagen || 'https://via.placeholder.com/200?text=' + encodeURIComponent(p.nombreProducto || p.nombre),
                categoria: p.nombreCategoria || p.categoria || 'General',
                stock: p.stock || 10,
                calificacion: p.calificacion || 4.5
            }));
            
            this.productosFiltrados = [...this.productos];
            this.renderizarProductos();
            this.cargarCategorias();
        } catch (error) {
            console.error('Error cargando productos:', error);
            tiendaUtils.notificacion('Error cargando productos, usando demo data', 'warning');
            // Usar productos de demostración si el API falla
            this.cargarProductosDemostración();
        }
    },

    // Productos de demostración para testing
    cargarProductosDemostración() {
        console.log('📋 Usando productos de demostración');
        this.productos = [
            {
                id: 1,
                nombre: 'Zapatilla Deportiva Nike',
                descripcion: 'Zapatilla cómoda y resistente',
                precio: 150.00,
                precioOriginal: 200.00,
                imagen: 'https://via.placeholder.com/200?text=Zapatilla+Nike',
                categoria: 'Zapatillas',
                stock: 25,
                rating: 4.5,
                resenas: 45,
                descuento: 25
            },
            {
                id: 2,
                nombre: 'Polo Adidas Clásico',
                descripcion: 'Polo de algodón premium',
                precio: 79.90,
                imagen: 'https://via.placeholder.com/200?text=Polo+Adidas',
                categoria: 'Polos',
                stock: 30,
                rating: 4.0,
                resenas: 28
            },
            {
                id: 3,
                nombre: 'Pantalón Jeans',
                descripcion: 'Pantalón jeans slim fit',
                precio: 89.90,
                imagen: 'https://via.placeholder.com/200?text=Pantalon+Jeans',
                categoria: 'Pantalones',
                stock: 15,
                rating: 4.2,
                resenas: 32
            }
        ];
        this.productosFiltrados = [...this.productos];
        this.renderizarProductos();
        this.cargarCategorias();
    },

    // Renderizar grid de productos
    renderizarProductos() {
        const grid = document.getElementById('productosGrid');
        const sinResultados = document.getElementById('sinResultados');

        if (this.productosFiltrados.length === 0) {
            grid.innerHTML = '';
            sinResultados.style.display = 'block';
            return;
        }

        sinResultados.style.display = 'none';
        grid.innerHTML = this.productosFiltrados.map(producto => `
            <div class="producto-card" data-id="${producto.id}">
                <div class="producto-imagen">
                    <img src="${producto.imagen || 'https://via.placeholder.com/220x200?text=Producto'}" alt="${producto.nombre}">
                    ${producto.descuento ? `<span class="badge-descuento">-${producto.descuento}%</span>` : ''}
                </div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-categoria">${producto.categoria || 'Sin categoría'}</p>
                    <div class="producto-precio">
                        <span class="precio-actual">${tiendaUtils.formatearDinero(producto.precio)}</span>
                        ${producto.precioOriginal ? `<span class="precio-original">${tiendaUtils.formatearDinero(producto.precioOriginal)}</span>` : ''}
                    </div>
                    <div class="producto-rating">
                        <span class="rating-stars">⭐ ${(producto.rating || 0).toFixed(1)}</span>
                        <span class="rating-count">(${producto.resenas || 0})</span>
                    </div>
                    <div class="producto-stock ${producto.stock > 0 ? 'disponible' : 'agotado'}">
                        ${producto.stock > 0 ? `<span>${producto.stock} disponibles</span>` : '<span>Agotado</span>'}
                    </div>
                    <button class="btn-ver-detalle" data-id="${producto.id}">Ver Detalle</button>
                </div>
            </div>
        `).join('');

        // Agregar event listeners
        document.querySelectorAll('.btn-ver-detalle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.mostrarDetalle(id);
            });
        });

        // Actualizar conteo
        document.getElementById('productosCount').textContent = 
            `Mostrando ${this.productosFiltrados.length} producto${this.productosFiltrados.length !== 1 ? 's' : ''}`;
    },

    // Mostrar modal con detalle del producto
    async mostrarDetalle(id) {
        const producto = this.productos.find(p => p.id == id);
        if (!producto) return;

        document.getElementById('detalleImagen').src = producto.imagen || 'https://via.placeholder.com/400x400?text=Producto';
        document.getElementById('detalleTitulo').textContent = producto.nombre;
        document.getElementById('detallePrecio').textContent = tiendaUtils.formatearDinero(producto.precio);
        document.getElementById('detalleDescripcion').textContent = producto.descripcion;
        document.getElementById('detalleRating').textContent = `⭐ ${(producto.rating || 0).toFixed(1)}/5`;
        document.getElementById('detalleResenas').textContent = `(${producto.resenas || 0} reseñas)`;

        const stockElement = document.getElementById('detalleStock');
        if (producto.stock > 0) {
            stockElement.innerHTML = `<span class="stock-disponible">✓ En Stock (${producto.stock})</span>`;
        } else {
            stockElement.innerHTML = `<span class="stock-agotado">✗ Agotado</span>`;
        }

        // Guardar producto actual para agregar al carrito
        window.productoActual = producto;
        
        // Obtener variantes del producto
        await this.cargarVariantesProducto(id);

        // Reset cantidad
        document.getElementById('cantidadInput').value = 1;

        // Mostrar modal
        document.getElementById('modalProducto').style.display = 'block';
    },

    // Cargar variantes de un producto
    async cargarVariantesProducto(idProducto) {
        try {
            const response = await fetch(`http://localhost:8080/api/productos/${idProducto}`);
            const data = await response.json();
            
            if (data.success && data.data && data.data.variantes && data.data.variantes.length > 0) {
                // Guardar la primera variante disponible
                window.varianteSeleccionada = data.data.variantes[0];
            }
        } catch (error) {
            console.error('Error al cargar variantes:', error);
        }
    },

    // Cargar categorías para filtros
    cargarCategorias() {
        const categorias = [...new Set(this.productos.map(p => p.categoria))].filter(Boolean);
        const container = document.getElementById('categoriasFiltro');
        
        container.innerHTML = categorias.map(categoria => `
            <label>
                <input type="checkbox" class="filtro-categoria" value="${categoria}">
                ${categoria}
            </label>
        `).join('');

        document.querySelectorAll('.filtro-categoria').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.aplicarFiltros());
        });
    },

    // Aplicar filtros
    aplicarFiltros() {
        const categoriaSeleccionadas = Array.from(
            document.querySelectorAll('.filtro-categoria:checked')
        ).map(c => c.value);

        const precioMin = parseInt(document.getElementById('precioMin').value);
        const precioMax = parseInt(document.getElementById('precioMax').value);

        const disponibilidad = document.querySelector('.filtro-disponible').checked;

        this.productosFiltrados = this.productos.filter(p => {
            const cumpleCategoria = categoriaSeleccionadas.length === 0 || categoriaSeleccionadas.includes(p.categoria);
            const cumplePrecio = p.precio >= precioMin && p.precio <= precioMax;
            const cumpleStock = !disponibilidad || p.stock > 0;

            return cumpleCategoria && cumplePrecio && cumpleStock;
        });

        this.renderizarProductos();
    },

    // Buscar productos
    buscarProductos(termino) {
        if (!termino) {
            this.productosFiltrados = [...this.productos];
        } else {
            this.productosFiltrados = this.productos.filter(p =>
                p.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                p.descripcion.toLowerCase().includes(termino.toLowerCase())
            );
        }
        this.renderizarProductos();
    },

    // Ordenar productos
    ordenarProductos(tipo) {
        switch(tipo) {
            case 'precio-asc':
                this.productosFiltrados.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                this.productosFiltrados.sort((a, b) => b.precio - a.precio);
                break;
            case 'nuevos':
                this.productosFiltrados.sort((a, b) => 
                    new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0)
                );
                break;
            case 'relevancia':
            default:
                this.productosFiltrados = [...this.productos];
        }
        this.renderizarProductos();
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos
    productosManager.cargarProductos();

    // Búsqueda
    const searchInput = document.getElementById('searchProductos');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            productosManager.buscarProductos(e.target.value);
        });
    }

    // Ordenamiento
    const ordenamiento = document.getElementById('ordenamiento');
    if (ordenamiento) {
        ordenamiento.addEventListener('change', (e) => {
            productosManager.ordenarProductos(e.target.value);
        });
    }

    // Filtros de precio
    const precioMin = document.getElementById('precioMin');
    const precioMax = document.getElementById('precioMax');
    if (precioMin && precioMax) {
        precioMin.addEventListener('input', () => {
            document.getElementById('precioMinDisplay').textContent = precioMin.value;
            productosManager.aplicarFiltros();
        });
        precioMax.addEventListener('input', () => {
            document.getElementById('precioMaxDisplay').textContent = precioMax.value;
            productosManager.aplicarFiltros();
        });
    }

    // Limpiar filtros
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            document.querySelectorAll('.filtro-categoria').forEach(c => c.checked = false);
            document.getElementById('precioMin').value = 0;
            document.getElementById('precioMax').value = 10000;
            document.getElementById('precioMinDisplay').textContent = 0;
            document.getElementById('precioMaxDisplay').textContent = 10000;
            productosManager.productosFiltrados = [...productosManager.productos];
            productosManager.renderizarProductos();
        });
    }

    // Botón agregar al carrito
    const btnAgregarCarrito = document.getElementById('btnAgregarCarrito');
    if (btnAgregarCarrito) {
        btnAgregarCarrito.addEventListener('click', async () => {
            if (!window.varianteSeleccionada || !window.varianteSeleccionada.idVariante) {
                alert('No hay variante disponible para este producto');
                return;
            }

            const cantidad = parseInt(document.getElementById('cantidadInput').value) || 1;
            
            const exito = await CarritoModule.agregarProducto(
                window.varianteSeleccionada.idVariante,
                cantidad
            );

            if (exito) {
                document.getElementById('modalProducto').style.display = 'none';
            }
        });
    }

    // Botones de cantidad en modal
    const btnMas = document.getElementById('btnMas');
    const btnMenos = document.getElementById('btnMenos');
    const cantidadInput = document.getElementById('cantidadInput');

    if (btnMas) {
        btnMas.addEventListener('click', () => {
            cantidadInput.value = Math.max(1, parseInt(cantidadInput.value) + 1);
        });
    }

    if (btnMenos) {
        btnMenos.addEventListener('click', () => {
            cantidadInput.value = Math.max(1, parseInt(cantidadInput.value) - 1);
        });
    }

    // Cerrar modal de producto
    const closeModalProducto = document.querySelector('#modalProducto .close');
    if (closeModalProducto) {
        closeModalProducto.addEventListener('click', () => {
            document.getElementById('modalProducto').style.display = 'none';
        });
    }
});
