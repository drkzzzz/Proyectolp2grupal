// ============================================
// productos-publicos.js - Tienda Pública Dinámica
// ============================================

console.log('🚀 productos-publicos.js - Cargando productos de tienda pública');

class ProductosPublicos {
    constructor() {
        // Configuración de API
        this.API_BASE_URL = 'http://localhost:8083/api';

        // Obtener ID de tienda de URL
        this.idTienda = this.obtenerIdTiendaDeURL();

        // Elementos DOM
        this.elementos = {
            grid: document.getElementById('productosGrid'),
            contador: document.getElementById('productosCount'),
            sinResultados: document.getElementById('sinResultados'),
            busqueda: document.getElementById('searchProductos'),
            ordenamiento: document.getElementById('ordenamiento'),
            tiendaNombre: document.getElementById('tiendaNombre'),
            tiendaInfo: document.getElementById('tiendaInfo')
        };

        // Guardar productos cargados
        this.productosCargados = [];
        this.infoTienda = null;

        console.log(`🏪 Tienda ID: ${this.idTienda}`);
        console.log(`🌐 API Base: ${this.API_BASE_URL}`);
    }
    
    obtenerIdTiendaDeURL() {
        console.log('🔍 Obteniendo ID de tienda de URL...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const idUrl = urlParams.get('tienda_id') || urlParams.get('id');
        
        if (idUrl) {
            console.log(`✅ ID de URL: ${idUrl}`);
            return parseInt(idUrl);
        }
        
        console.warn('⚠️ No se encontró ID de tienda en URL');
        return null;
    }
    
    async iniciar() {
        console.log('🚀 Iniciando carga de productos...');
        
        if (!this.idTienda) {
            this.mostrarError('ID de tienda no especificado en la URL');
            return;
        }

        if (!this.elementos.grid) {
            console.error('❌ No se encontró productosGrid');
            return;
        }

        // Mostrar loading
        this.mostrarLoading();

        try {
            // Obtener nombre de tienda
            await this.obtenerNombreTienda();
            
            // Cargar productos REALES del backend
            const productos = await this.obtenerProductosBackend();
            this.productosCargados = productos;
            
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
    
    async obtenerNombreTienda() {
        console.log(`📡 Obteniendo nombre de tienda ${this.idTienda}...`);
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/empresas/${this.idTienda}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Extraer tienda si viene en respuesta wrapper
                const tienda = data.data || data;
                const nombreTienda = tienda.nombreTienda || tienda.nombre_tienda || `Tienda ${this.idTienda}`;
                
                // Actualizar el título de la página
                document.title = `${nombreTienda} - TapStyle`;
                
                // Actualizar nombre en heading
                if (this.elementos.tiendaNombre) {
                    this.elementos.tiendaNombre.textContent = nombreTienda;
                }
                
                // Actualizar info de tienda
                if (this.elementos.tiendaInfo) {
                    this.elementos.tiendaInfo.innerHTML = `
                        <h1>${nombreTienda}</h1>
                        ${tienda.telefono ? `<p>📞 ${tienda.telefono}</p>` : ''}
                        ${tienda.emailContacto ? `<p>📧 ${tienda.emailContacto}</p>` : ''}
                        <p>✅ Estado: ${tienda.estadoAprobacion || 'Activa'}</p>
                    `;
                }
                
                console.log(`✅ Nombre de tienda: ${nombreTienda}`);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo obtener nombre de tienda:', error.message);
        }
    }
    
    async obtenerProductosBackend() {
        console.log(`📡 Conectando a backend para productos de tienda ${this.idTienda}...`);
        
        // Prueba endpoints en orden de preferencia
        const endpoints = [
            // Endpoint correcto para productos de empresa
            `${this.API_BASE_URL}/productos/empresa/${this.idTienda}`,
            
            // Alternativas
            `${this.API_BASE_URL}/productos?empresaId=${this.idTienda}`,
            `${this.API_BASE_URL}/productos?idEmpresa=${this.idTienda}`,
            `${this.API_BASE_URL}/productos`,
            `http://localhost:8083/productos/empresa/${this.idTienda}`
        ];
        
        let productos = [];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`🔍 Probando endpoint: ${endpoint}`);
                
                const response = await fetch(endpoint, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log(`📊 Respuesta: ${response.status} ${response.statusText}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    console.log('📦 Estructura de respuesta:', data);
                    
                    // Manejar ApiResponse wrapper
                    let productosData = [];
                    
                    if (data.data && Array.isArray(data.data)) {
                        // Respuesta de ApiResponse<List<ProductoDTO>>
                        productosData = data.data;
                    } else if (Array.isArray(data)) {
                        // Array directo
                        productosData = data;
                    } else if (data.productos && Array.isArray(data.productos)) {
                        // Propiedad productos
                        productosData = data.productos;
                    }
                    
                    if (productosData.length > 0) {
                        productos = productosData;
                        
                        // Si es endpoint general, filtrar por empresa
                        if (endpoint.includes('/productos') && !endpoint.includes('empresa/')) {
                            productos = productos.filter(p => p.id_empresa === this.idTienda || p.empresaId === this.idTienda);
                        }
                        
                        console.log(`✅ ${productos.length} productos obtenidos de ${endpoint}`);
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
            productos = this.obtenerProductosEjemplo();
        }
        
        return productos;
    }
    
    obtenerProductosEjemplo() {
        console.log('🔄 Usando productos de ejemplo por ID de tienda');
        
        const productosBD = {
            122: [ // SANTIS
                {
                    id_producto: 500,
                    nombre_producto: "Zapatilla Nike Air Max",
                    descripcion: "Zapatilla urbana con tecnología Air Max",
                    precio: 250.00,
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
                    descripcion: "Polo del equipo de fútbol",
                    precio: 65.00,
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
                    descripcion: "Zapatilla clásica de Puma",
                    precio: 220.00,
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
                    nombre_producto: "Polo Nike",
                    descripcion: "Polo clásico color rojo",
                    precio: 45.00,
                    id_categoria: 51,
                    categoria: "Polos",
                    id_marca: 50,
                    marca: "Nike",
                    stock: 15,
                    imagen: "https://placehold.co/300x300/8B5CF6/ffffff?text=Polo+Nike",
                    id_empresa: 122
                }
            ]
        };
        
        return productosBD[this.idTienda] || [];
    }
    
    mostrarProductos(productos) {
        console.log(`📋 Mostrando ${productos.length} productos`);
        
        this.elementos.grid.innerHTML = '';
        
        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            
            // Mapear nombres camelCase del backend a snake_case
            const nombreProducto = producto.nombreProducto || producto.nombre_producto || 'Producto sin nombre';
            const categoria = producto.nombreCategoria || producto.categoria || 'Sin categoría';
            const marca = producto.nombreMarca || producto.marca || '';
            const stock = producto.stock || 0;
            const descripcion = producto.descripcion || '';
            const precio = producto.precio || 0;
            const disponible = stock > 0;
            
            // Imagen con fallback
            const imagen = producto.imagen || 
                `https://placehold.co/300x300/6B7280/ffffff?text=${encodeURIComponent(nombreProducto.substring(0, 15))}`;
            
            card.innerHTML = `
                <div class="producto-imagen">
                    <img src="${imagen}" 
                         alt="${nombreProducto}"
                         onerror="this.src='https://placehold.co/300x300?text=Error+Imagen'">
                    ${!disponible ? '<span class="badge-agotado">Agotado</span>' : ''}
                </div>
                <div class="producto-info">
                    <h3 class="producto-titulo">${nombreProducto}</h3>
                    <p class="producto-categoria">📁 ${categoria}</p>
                    ${marca ? `<p class="producto-marca">🏷️ ${marca}</p>` : ''}
                    ${descripcion ? `<p class="producto-descripcion">${descripcion}</p>` : ''}
                    <div class="producto-precio">S/ ${parseFloat(precio).toFixed(2)}</div>
                    <div class="producto-stock">
                        ${disponible ? 
                            `<span class="stock-disponible">✅ ${stock} disponibles</span>` : 
                            '<span class="stock-agotado">❌ Sin stock</span>'}
                    </div>
                    <button class="btn-agregar-carrito" ${!disponible ? 'disabled' : ''}>
                        ${disponible ? '🛒 Agregar al carrito' : 'No disponible'}
                    </button>
                </div>
            `;
            
            this.elementos.grid.appendChild(card);
        });
        
        // Actualizar contador
        if (this.elementos.contador) {
            this.elementos.contador.textContent = `Mostrando ${productos.length} productos`;
        }
        
        // Ocultar sin resultados
        if (this.elementos.sinResultados) {
            this.elementos.sinResultados.style.display = 'none';
        }
    }
    
    mostrarSinProductos() {
        this.elementos.grid.innerHTML = '';
        if (this.elementos.sinResultados) {
            this.elementos.sinResultados.style.display = 'block';
        }
    }
    
    mostrarLoading() {
        this.elementos.grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p>⏳ Cargando productos...</p>
            </div>
        `;
    }
    
    mostrarError(mensaje) {
        this.elementos.grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: red;">
                <p>❌ ${mensaje}</p>
            </div>
        `;
    }
    
    configurarFiltros() {
        console.log('🔧 Configurando filtros...');
        
        if (this.elementos.busqueda) {
            this.elementos.busqueda.addEventListener('input', (e) => {
                this.aplicarFiltros();
            });
        }
        
        if (this.elementos.ordenamiento) {
            this.elementos.ordenamiento.addEventListener('change', (e) => {
                this.aplicarFiltros();
            });
        }
    }
    
    aplicarFiltros() {
        let productos = [...this.productosCargados];
        
        // Filtro de búsqueda
        const termino = this.elementos.busqueda?.value?.toLowerCase() || '';
        if (termino) {
            productos = productos.filter(p => {
                const nombre = (p.nombreProducto || p.nombre_producto || '').toLowerCase();
                const desc = (p.descripcion || '').toLowerCase();
                const marca = (p.nombreMarca || p.marca || '').toLowerCase();
                return nombre.includes(termino) || desc.includes(termino) || marca.includes(termino);
            });
        }
        
        // Ordenamiento
        const orden = this.elementos.ordenamiento?.value || 'relevancia';
        productos = this.ordenarProductos(productos, orden);
        
        // Mostrar resultados
        if (productos.length === 0) {
            this.mostrarSinProductos();
        } else {
            this.mostrarProductos(productos);
        }
    }
    
    ordenarProductos(productos, orden) {
        const copia = [...productos];
        
        switch(orden) {
            case 'precio-asc':
                copia.sort((a, b) => (a.precio || 0) - (b.precio || 0));
                break;
            case 'precio-desc':
                copia.sort((a, b) => (b.precio || 0) - (a.precio || 0));
                break;
            case 'nombre':
                copia.sort((a, b) => {
                    const nameA = a.nombreProducto || a.nombre_producto || '';
                    const nameB = b.nombreProducto || b.nombre_producto || '';
                    return nameA.localeCompare(nameB);
                });
                break;
            default:
                // Mantener orden original
                break;
        }
        
        return copia;
    }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const tienda = new ProductosPublicos();
    tienda.iniciar();
});
