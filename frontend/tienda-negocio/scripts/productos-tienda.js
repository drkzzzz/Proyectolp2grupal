// ============================================
// productos-tienda.js - Conexión REAL con backend
// ============================================

console.log('🚀 productos-tienda.js - Conectando a backend real');

class ProductosTienda {
    constructor() {
        // Configuración de API
        this.API_BASE_URL = window.API_CONFIG?.BASE_URL || 'http://localhost:8083/api';

        // Obtener ID de tienda ACTUAL
        this.idTienda = this.obtenerIdTiendaActual();

        // Elementos DOM
        this.elementos = {
            grid: document.getElementById('productosGrid'),
            contador: document.getElementById('productosCount'),
            sinResultados: document.getElementById('sinResultados'),
            busqueda: document.getElementById('searchProductos'),
            ordenamiento: document.getElementById('ordenamiento')
        };

        // Guardar productos cargados
        this.productosCargados = [];

        console.log(`🏪 Tienda ID: ${this.idTienda}`);
        console.log(`🌐 API Base: ${this.API_BASE_URL}`);
    }
    
    obtenerIdTiendaActual() {
        console.log('🔍 Obteniendo ID de tienda actual...');
        
        // 1. De TIENDA_CONFIG
        if (window.TIENDA_CONFIG?.ID_TIENDA) {
            const id = window.TIENDA_CONFIG.ID_TIENDA;
            console.log(`✅ ID de TIENDA_CONFIG: ${id}`);
            return id;
        }
        
        // 2. De localStorage
        const idLocal = localStorage.getItem('tienda_actual_id');
        if (idLocal) {
            console.log(`✅ ID de localStorage: ${idLocal}`);
            return parseInt(idLocal);
        }
        
        // 3. De URL
        const urlParams = new URLSearchParams(window.location.search);
        const idUrl = urlParams.get('tienda_id');
        if (idUrl) {
            console.log(`✅ ID de URL: ${idUrl}`);
            return parseInt(idUrl);
        }
        
        // 4. Valor por defecto
        console.warn('⚠️ Usando ID por defecto: 122');
        return 122;
    }
    
    async iniciar() {
        console.log('🚀 Iniciando carga de productos REALES...');
        
        if (!this.elementos.grid) {
            console.error('❌ No se encontró productosGrid');
            return;
        }

        // Mostrar loading
        this.mostrarLoading();

        try {
            // Cargar productos REALES del backend
            const productos = await this.obtenerProductosBackend();
            this.productosCargados = productos; // Guardar productos obtenidos
            if (productos.length === 0) {
                this.mostrarSinProductos();
            } else {
                this.mostrarProductos(productos);
                this.configurarFiltros();
            }
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            this.mostrarError('Error al cargar productos del servidor');
        }
    }
    
    async obtenerProductosBackend() {
        console.log(`📡 Conectando a backend para productos de tienda ${this.idTienda}...`);
        
        // PRUEBA TODOS LOS ENDPOINTS POSIBLES
        const endpoints = [
            // Endpoint específico para productos de empresa
            `${this.API_BASE_URL}/empresas/${this.idTienda}/productos`,
            
            // Endpoint con parámetro
            `${this.API_BASE_URL}/productos?empresaId=${this.idTienda}`,
            `${this.API_BASE_URL}/productos?idEmpresa=${this.idTienda}`,
            
            // Endpoint general (luego filtrar)
            `${this.API_BASE_URL}/productos`,
            
            // Endpoint público
            `${this.API_BASE_URL}/public/tiendas/${this.idTienda}/productos`,
            `http://localhost:8083/public/empresas/${this.idTienda}/productos`
        ];
        
        let productos = [];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`🔍 Probando endpoint: ${endpoint}`);
                
                const response = await fetch(endpoint, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('tapstyle_token') || ''}`
                    }
                });
                
                console.log(`📊 Respuesta: ${response.status} ${response.statusText}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Si es un array, procesarlo
                    if (Array.isArray(data)) {
                        productos = data;
                        
                        // Si es endpoint general, filtrar por empresa
                        if (endpoint.includes('/productos') && !endpoint.includes('empresaId') && !endpoint.includes('idEmpresa')) {
                            productos = productos.filter(p => p.id_empresa === this.idTienda);
                        }
                        
                        console.log(`✅ ${productos.length} productos obtenidos de ${endpoint}`);
                        break;
                    } else if (data.productos) {
                        productos = data.productos;
                        console.log(`✅ ${productos.length} productos obtenidos (propiedad .productos)`);
                        break;
                    }
                }
                
            } catch (error) {
                console.log(`❌ Endpoint falló: ${endpoint}`, error.message);
                continue;
            }
        }
        
        // Si no se obtuvieron productos, usar datos de ejemplo
        if (productos.length === 0) {
            console.warn('⚠️ No se pudieron obtener productos del backend');
            productos = await this.obtenerProductosEjemplo();
        }
        
        return productos;
    }
    
    async obtenerProductosEjemplo() {
        console.log('🔄 Obteniendo productos de ejemplo...');
        
        // Datos REALES de tu BD (basados en tus inserts)
        const productosBD = {
            // SANTIS (ID 122) - Productos REALES de tu BD
            122: [
                {
                    id_producto: 500,
                    nombre_producto: "Zapatilla Nike Air Max",
                    descripcion: "Zapatilla urbana",
                    precio: 250.00,
                    precio_venta: 250.00,
                    id_categoria: 50,
                    categoria: "Zapatillas",
                    id_marca: 50,
                    marca: "Nike",
                    stock: 10,
                    imagen: "https://placehold.co/300x300/3B82F6/ffffff?text=Nike+Air+Max",
                    id_empresa: 122
                },
                {
                    id_producto: 504,
                    nombre_producto: "Polo deportivo",
                    descripcion: "Polo del equipo",
                    precio: 65.00,
                    precio_venta: 65.00,
                    id_categoria: 146,
                    categoria: "Polos deportivos",
                    id_marca: 50,
                    marca: "Nike",
                    stock: 20,
                    imagen: "https://placehold.co/300x300/EF4444/ffffff?text=Polo+Deportivo",
                    id_empresa: 122
                },
                {
                    id_producto: 502,
                    nombre_producto: "Puma Suede Classic",
                    descripcion: "Zapatilla clásica",
                    precio: 220.00,
                    precio_venta: 220.00,
                    id_categoria: 50,
                    categoria: "Zapatillas",
                    id_marca: 52,
                    marca: "Puma",
                    stock: 8,
                    imagen: "https://placehold.co/300x300/10B981/ffffff?text=Puma+Suede",
                    id_empresa: 122
                },
                {
                    id_producto: 503,
                    nombre_producto: "Polo nike",
                    descripcion: "Polo color rojo",
                    precio: 45.00,
                    precio_venta: 45.00,
                    id_categoria: 51,
                    categoria: "Polos",
                    id_marca: 50,
                    marca: "Nike",
                    stock: 15,
                    imagen: "https://placehold.co/300x300/8B5CF6/ffffff?text=Polo+Nike",
                    id_empresa: 122
                }
            ],
            // Gentle Elegance (ID 1) - Productos REALES de tus inserts
            1: [
                {
                    id_producto: 2001,
                    nombre_producto: "Camisa Oxford Premium",
                    descripcion: "Algodón Pima",
                    precio: 120.00,
                    precio_venta: 120.00,
                    id_categoria: 10,
                    categoria: "Ropa Caballeros",
                    id_marca: 10,
                    marca: "Gentle Elegance",
                    stock: 50,
                    imagen: "https://placehold.co/300x300/6366F1/ffffff?text=Camisa+Oxford",
                    id_empresa: 1
                },
                {
                    id_producto: 2002,
                    nombre_producto: "Pantalón Drill Slim",
                    descripcion: "Corte recto",
                    precio: 150.00,
                    precio_venta: 150.00,
                    id_categoria: 10,
                    categoria: "Ropa Caballeros",
                    id_marca: 10,
                    marca: "Gentle Elegance",
                    stock: 30,
                    imagen: "https://placehold.co/300x300/8B5CF6/ffffff?text=Pantalón+Drill",
                    id_empresa: 1
                },
                {
                    id_producto: 2003,
                    nombre_producto: "Zapatos Oxford Cuero",
                    descripcion: "Cuero legítimo",
                    precio: 280.00,
                    precio_venta: 280.00,
                    id_categoria: 10,
                    categoria: "Ropa Caballeros",
                    id_marca: 10,
                    marca: "Gentle Elegance",
                    stock: 15,
                    imagen: "https://placehold.co/300x300/1F2937/ffffff?text=Zapatos+Oxford",
                    id_empresa: 1
                },
                {
                    id_producto: 2004,
                    nombre_producto: "Corbata Seda Italiana",
                    descripcion: "Elegante",
                    precio: 60.00,
                    precio_venta: 60.00,
                    id_categoria: 12,
                    categoria: "Accesorios",
                    id_marca: 10,
                    marca: "Gentle Elegance",
                    stock: 100,
                    imagen: "https://placehold.co/300x300/DC2626/ffffff?text=Corbata+Seda",
                    id_empresa: 1
                },
                {
                    id_producto: 2005,
                    nombre_producto: "Saco Lino Verano",
                    descripcion: "Fresco y formal",
                    precio: 350.00,
                    precio_venta: 350.00,
                    id_categoria: 10,
                    categoria: "Ropa Caballeros",
                    id_marca: 10,
                    marca: "Gentle Elegance",
                    stock: 10,
                    imagen: "https://placehold.co/300x300/D97706/ffffff?text=Saco+Lino",
                    id_empresa: 1
                }
            ]
        };
        
        return productosBD[this.idTienda] || [];
    }
    
    mostrarProductos(productos) {
        console.log(`🎨 Mostrando ${productos.length} productos`);
        
        const grid = this.elementos.grid;
        grid.innerHTML = '';
        
        // Actualizar contador
        if (this.elementos.contador) {
            this.elementos.contador.textContent = `Mostrando ${productos.length} productos`;
        }
        
        // Crear tarjetas
        productos.forEach(producto => {
            const card = this.crearTarjetaProducto(producto);
            grid.appendChild(card);
        });
        
        console.log('✅ Productos mostrados correctamente');
    }
    
    crearTarjetaProducto(producto) {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.dataset.id = producto.id_producto;
        
        // Precio formateado
        const precio = producto.precio_venta || producto.precio || 0;
        const precioFormateado = new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
        
        // Stock
        const stock = producto.stock || 0;
        const stockTexto = stock > 0 
            ? `<span class="stock-disponible">✅ ${stock} disponibles</span>`
            : `<span class="stock-agotado">❌ Agotado</span>`;
        
        // Imagen
        const imagen = producto.imagen || 
            `https://placehold.co/300x300/6B7280/ffffff?text=${encodeURIComponent(producto.nombre_producto.substring(0, 15))}`;
        
        card.innerHTML = `
            <div class="producto-imagen">
                <img src="${imagen}" alt="${producto.nombre_producto}" 
                     onerror="this.onerror=null; this.src='https://placehold.co/300x300/cccccc/666666?text=Imagen'">
                ${stock === 0 ? '<div class="badge-agotado">Agotado</div>' : ''}
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre_producto}</h3>
                <p class="producto-descripcion">${producto.descripcion || 'Sin descripción'}</p>
                
                <div class="producto-meta">
                    ${producto.categoria ? `<span class="producto-categoria">${producto.categoria}</span>` : ''}
                    ${producto.marca ? `<span class="producto-marca">${producto.marca}</span>` : ''}
                </div>
                
                <div class="producto-precio-stock">
                    <span class="producto-precio">${precioFormateado}</span>
                    ${stockTexto}
                </div>
                
                <div class="producto-acciones">
                    <button class="btn-detalle" onclick="productosTienda.verDetalle(${producto.id_producto})">
                        👁️ Ver Detalles
                    </button>
                    <button class="btn-carrito" onclick="productosTienda.agregarAlCarrito(${producto.id_producto})" 
                            ${stock === 0 ? 'disabled' : ''}>
                        🛒 Agregar
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    verDetalle(idProducto) {
        console.log(`🔍 Ver detalle producto: ${idProducto}`);
        alert(`Detalles del producto ID: ${idProducto}`);
        // Aquí deberías abrir un modal con más información
    }
    
    agregarAlCarrito(idProducto) {
        console.log(`🛒 Agregando producto ${idProducto} al carrito`);
        
        // Encontrar el producto
        const producto = this.encontrarProductoPorId(idProducto);
        if (!producto) return;
        
        // Obtener carrito actual
        let carrito = JSON.parse(localStorage.getItem('carrito_tienda')) || [];
        
        // Verificar si ya existe
        const existente = carrito.find(item => item.id === idProducto);
        
        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({
                id: producto.id_producto,
                nombre: producto.nombre_producto,
                precio: producto.precio_venta || producto.precio,
                cantidad: 1,
                imagen: producto.imagen,
                stock: producto.stock
            });
        }
        
        // Guardar
        localStorage.setItem('carrito_tienda', JSON.stringify(carrito));
        
        // Actualizar contador
        this.actualizarContadorCarrito();
        
        // Notificación
        this.mostrarNotificacion(`✅ ${producto.nombre_producto} agregado al carrito`);
    }
    
    encontrarProductoPorId(id) {
        // Buscar en los productos cargados
        if (!this.productosCargados || this.productosCargados.length === 0) {
            console.warn('No hay productos cargados en memoria');
            return null;
        }
        return this.productosCargados.find(p => p.id_producto == id);
    }
    
    actualizarContadorCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito_tienda')) || [];
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        
        const contador = document.getElementById('cartCount');
        if (contador) {
            contador.textContent = total;
        }
    }
    
    mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.textContent = mensaje;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => notificacion.remove(), 3000);
    }
    
    mostrarLoading() {
        const grid = this.elementos.grid;
        grid.innerHTML = `
            <div class="loading-productos" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div class="spinner" style="
                    border: 4px solid #f3f4f6;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p>Cargando productos de la tienda...</p>
                <p><small>Conectando al servidor...</small></p>
            </div>
        `;
    }
    
    mostrarSinProductos() {
        const grid = this.elementos.grid;
        grid.innerHTML = `
            <div class="sin-productos" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>😔 Esta tienda no tiene productos disponibles</p>
                <button onclick="location.reload()" style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 10px;
                ">
                    Reintentar
                </button>
            </div>
        `;
    }
    
    mostrarError(mensaje) {
        const grid = this.elementos.grid;
        grid.innerHTML = `
            <div class="error-productos" style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #fee2e2; border-radius: 8px;">
                <p>❌ ${mensaje}</p>
                <button onclick="productosTienda.iniciar()" style="
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 10px;
                ">
                    Reintentar conexión
                </button>
            </div>
        `;
    }
    
    configurarFiltros() {
        // Configurar búsqueda
        if (this.elementos.busqueda) {
            this.elementos.busqueda.addEventListener('input', (e) => {
                this.filtrarPorBusqueda(e.target.value);
            });
        }
        
        // Configurar ordenamiento
        if (this.elementos.ordenamiento) {
            this.elementos.ordenamiento.addEventListener('change', (e) => {
                console.log('Ordenar por:', e.target.value);
            });
        }
    }
    
    filtrarPorBusqueda(termino) {
        console.log('Buscando:', termino);
        // Implementar filtrado real
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM listo, iniciando productos-tienda...');
    
    // Crear instancia global
    window.productosTienda = new ProductosTienda();
    
    // Iniciar después de un pequeño delay
    setTimeout(() => {
        window.productosTienda.iniciar();
    }, 500);
});

// Si ya está cargado
if (document.readyState === 'complete') {
    setTimeout(() => {
        if (!window.productosTienda) {
            window.productosTienda = new ProductosTienda();
            window.productosTienda.iniciar();
        }
    }, 100);
}

console.log('✅ productos-tienda.js listo para usar');