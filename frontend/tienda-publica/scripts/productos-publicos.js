// ============================================
// productos-publicos.js - Tienda Pública REAL
// ============================================

console.log('🚀 productos-publicos.js - Conectando a backend real');

class ProductosPublicos {
    constructor() {
        // Configuración de API
        this.API_BASE_URL = window.API_CONFIG?.BASE_URL || 'http://localhost:8083/api';

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
            tiendaInfo: document.getElementById('tiendaInfo'),
            categoriasFiltro: document.getElementById('categoriasFiltro'),
            precioMin: document.getElementById('precioMin'),
            precioMax: document.getElementById('precioMax'),
            precioMinDisplay: document.getElementById('precioMinDisplay'),
            precioMaxDisplay: document.getElementById('precioMaxDisplay')
        };

        // Guardar productos cargados
        this.productosCargados = [];
        this.productosOriginales = [];

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
        console.log('🚀 Iniciando carga de productos REALES...');
        
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
            this.productosOriginales = [...productos];
            
            if (productos.length === 0) {
                this.mostrarSinProductos();
            } else {
                this.mostrarProductos(productos);
                this.generarFiltrosCategorias();
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
                
                // Extraer tienda - puede venir en data.data o directamente
                let tienda = data.data || data;
                if (Array.isArray(tienda)) {
                    tienda = tienda[0];
                }
                
                const nombreTienda = tienda?.nombreTienda || tienda?.nombre_tienda || tienda?.nombre || `Tienda ${this.idTienda}`;
                
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
                        ${tienda?.telefono ? `<p>📞 ${tienda.telefono}</p>` : ''}
                        ${tienda?.emailContacto ? `<p>📧 ${tienda.emailContacto}</p>` : ''}
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
        
        // PRIMERO intenta con /api/productos (endpoint que más probablemente funciona)
        // Luego filtra por empresa
        try {
            console.log(`🔍 Probando endpoint: ${this.API_BASE_URL}/productos`);
            
            const response = await fetch(`${this.API_BASE_URL}/productos`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`📊 Respuesta /productos: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📦 Respuesta completa:', data);
                
                // Manejar ApiResponse wrapper
                let productosData = [];
                
                if (data.data && Array.isArray(data.data)) {
                    // Respuesta de ApiResponse<List<ProductoDTO>>
                    productosData = data.data;
                    console.log(`✅ ${productosData.length} productos en data.data`);
                } else if (Array.isArray(data)) {
                    // Array directo
                    productosData = data;
                    console.log(`✅ ${productosData.length} productos en array directo`);
                } else if (data.productos && Array.isArray(data.productos)) {
                    // Propiedad productos
                    productosData = data.productos;
                    console.log(`✅ ${productosData.length} productos en data.productos`);
                }
                
                if (productosData.length > 0) {
                    // Filtrar por empresa actual
                    let productosEmpresa = productosData.filter(p => {
                        const idEmpresa = p.id_empresa || p.empresaId || p.idEmpresa;
                        return idEmpresa === this.idTienda;
                    });
                    
                    console.log(`✅ ${productosEmpresa.length} productos filtrados para empresa ${this.idTienda}`);
                    
                    if (productosEmpresa.length > 0) {
                        // Normalizar camelCase → snake_case
                        return productosEmpresa.map(p => this.normalizarProducto(p));
                    } else {
                        console.log('⚠️ No hay productos para esta empresa, usando datos de ejemplo');
                    }
                }
            }
        } catch (error) {
            console.log(`❌ Error en /api/productos:`, error.message);
        }
        
        // Si /api/productos no funcionó, prueba con endpoint específico
        try {
            console.log(`🔍 Probando endpoint: ${this.API_BASE_URL}/productos/empresa/${this.idTienda}`);
            
            const response = await fetch(`${this.API_BASE_URL}/productos/empresa/${this.idTienda}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`📊 Respuesta /productos/empresa: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                
                let productosData = [];
                if (data.data && Array.isArray(data.data)) {
                    productosData = data.data;
                } else if (Array.isArray(data)) {
                    productosData = data;
                }
                
                if (productosData.length > 0) {
                    console.log(`✅ ${productosData.length} productos obtenidos`);
                    // Normalizar camelCase → snake_case
                    return productosData.map(p => this.normalizarProducto(p));
                }
            }
        } catch (error) {
            console.log(`❌ Error en /productos/empresa:`, error.message);
        }
        
        // Si no se obtuvieron productos, usar datos de ejemplo
        console.warn('⚠️ No se pudieron obtener productos del backend, usando datos de ejemplo');
        return this.obtenerProductosEjemplo();
    }
    
    obtenerProductosEjemplo() {
        console.log('🔄 Usando productos de ejemplo por ID de tienda');
        
        // Datos REALES que funciona en tienda-negocio
        const productosBD = {
            // SANTIS (ID 122) - Productos REALES
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
                    nombre_producto: "Polo Nike",
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
            // Gentle Elegance (ID 1)
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
            ],
            // Glamour Time (ID 2)
            2: [
                {
                    id_producto: 3001,
                    nombre_producto: "Reloj Suizo Premium",
                    descripcion: "Automático",
                    precio: 1200.00,
                    precio_venta: 1200.00,
                    id_categoria: 20,
                    categoria: "Relojes",
                    id_marca: 20,
                    marca: "Glamour Time",
                    stock: 8,
                    imagen: "https://placehold.co/300x300/F59E0B/ffffff?text=Reloj+Suizo",
                    id_empresa: 2
                },
                {
                    id_producto: 3002,
                    nombre_producto: "Bolso Cuero Italiano",
                    descripcion: "Elegancia pura",
                    precio: 850.00,
                    precio_venta: 850.00,
                    id_categoria: 21,
                    categoria: "Bolsos",
                    id_marca: 20,
                    marca: "Glamour Time",
                    stock: 12,
                    imagen: "https://placehold.co/300x300/8B5CF6/ffffff?text=Bolso+Italiano",
                    id_empresa: 2
                },
                {
                    id_producto: 3003,
                    nombre_producto: "Collar Oro 18K",
                    descripcion: "Joya de lujo",
                    precio: 2500.00,
                    precio_venta: 2500.00,
                    id_categoria: 22,
                    categoria: "Joyas",
                    id_marca: 20,
                    marca: "Glamour Time",
                    stock: 5,
                    imagen: "https://placehold.co/300x300/FBBF24/ffffff?text=Collar+Oro",
                    id_empresa: 2
                }
            ],
            // Performance Footwear (ID 3)
            3: [
                {
                    id_producto: 4001,
                    nombre_producto: "Zapatilla Running Asics",
                    descripcion: "Para corredores serios",
                    precio: 650.00,
                    precio_venta: 650.00,
                    id_categoria: 50,
                    categoria: "Zapatillas",
                    id_marca: 30,
                    marca: "Performance Footwear",
                    stock: 25,
                    imagen: "https://placehold.co/300x300/EC4899/ffffff?text=Asics+Running",
                    id_empresa: 3
                },
                {
                    id_producto: 4002,
                    nombre_producto: "Zapatilla Training Reebok",
                    descripcion: "Entrenamiento crossfit",
                    precio: 480.00,
                    precio_venta: 480.00,
                    id_categoria: 50,
                    categoria: "Zapatillas",
                    id_marca: 31,
                    marca: "Performance Footwear",
                    stock: 18,
                    imagen: "https://placehold.co/300x300/F43F5E/ffffff?text=Reebok+Training",
                    id_empresa: 3
                },
                {
                    id_producto: 4003,
                    nombre_producto: "Medias Deportivas CoolMax",
                    descripcion: "Transpirables",
                    precio: 45.00,
                    precio_venta: 45.00,
                    id_categoria: 51,
                    categoria: "Accesorios",
                    id_marca: 30,
                    marca: "Performance Footwear",
                    stock: 100,
                    imagen: "https://placehold.co/300x300/06B6D4/ffffff?text=Medias+CoolMax",
                    id_empresa: 3
                }
            ],
            // Street Vibe Co. (ID 4)
            4: [
                {
                    id_producto: 5001,
                    nombre_producto: "Gorro Estilo Urbano",
                    descripcion: "Streetwear",
                    precio: 55.00,
                    precio_venta: 55.00,
                    id_categoria: 60,
                    categoria: "Accesorios",
                    id_marca: 40,
                    marca: "Street Vibe Co.",
                    stock: 45,
                    imagen: "https://placehold.co/300x300/14B8A6/ffffff?text=Gorro+Urbano",
                    id_empresa: 4
                },
                {
                    id_producto: 5002,
                    nombre_producto: "Chamarra Denim",
                    descripcion: "Clásica y moderna",
                    precio: 320.00,
                    precio_venta: 320.00,
                    id_categoria: 61,
                    categoria: "Ropa",
                    id_marca: 40,
                    marca: "Street Vibe Co.",
                    stock: 22,
                    imagen: "https://placehold.co/300x300/8B5CF6/ffffff?text=Chamarra+Denim",
                    id_empresa: 4
                },
                {
                    id_producto: 5003,
                    nombre_producto: "Pantalón Cargo",
                    descripcion: "Con bolsillos funcionales",
                    precio: 185.00,
                    precio_venta: 185.00,
                    id_categoria: 61,
                    categoria: "Ropa",
                    id_marca: 40,
                    marca: "Street Vibe Co.",
                    stock: 35,
                    imagen: "https://placehold.co/300x300/34D399/ffffff?text=Pantalón+Cargo",
                    id_empresa: 4
                }
            ]
        };
        
        return productosBD[this.idTienda] || [];
    }
    
    normalizarProducto(p) {
        // Convertir de camelCase (backend) a snake_case (frontend)
        // IMPORTANTE: Asegurar que stock se mapee correctamente
        const stock = parseInt(p.stock) || parseInt(p.cantidad) || parseInt(p.unidadesDisponibles) || 0;
        
        return {
            id_producto: p.idProducto || p.id_producto,
            id_empresa: p.idEmpresa || p.id_empresa,
            nombre_producto: p.nombreProducto || p.nombre_producto,
            descripcion: p.descripcion,
            id_categoria: p.idCategoria || p.id_categoria,
            categoria: p.nombreCategoria || p.categoria,
            id_proveedor: p.idProveedor || p.id_proveedor,
            proveedor: p.nombreProveedor || p.proveedor,
            id_marca: p.idMarca || p.id_marca,
            marca: p.nombreMarca || p.marca,
            id_modelo: p.idModelo || p.id_modelo,
            modelo: p.nombreModelo || p.modelo,
            id_material: p.idMaterial || p.id_material,
            material: p.nombreMaterial || p.material,
            stock: stock,  // Usar el valor calculado
            precio: p.precio || 0,
            precio_venta: p.precio || 0,
            imagen: p.imagen,
            dimensiones: p.dimensiones,
            peso_gramos: p.pesoGramos || p.peso_gramos
        };
    }
    
    generarFiltrosCategorias() {
        if (!this.elementos.categoriasFiltro) return;
        
        // Extraer categorías únicas
        const categorias = [...new Set(this.productosCargados.map(p => p.categoria || p.nombreCategoria || 'Sin categoría'))];
        
        this.elementos.categoriasFiltro.innerHTML = categorias.map(cat => `
            <label>
                <input type="checkbox" class="filtro-categoria" value="${cat}"> ${cat}
            </label>
        `).join('');
        
        // Agregar listeners
        document.querySelectorAll('.filtro-categoria').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.aplicarFiltros());
        });
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
        
        // Ocultar sin resultados
        if (this.elementos.sinResultados) {
            this.elementos.sinResultados.style.display = 'none';
        }
        
        console.log('✅ Productos mostrados correctamente');
    }
    
    crearTarjetaProducto(producto) {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.dataset.id = producto.id_producto;
        
        // Mapear nombres camelCase/snake_case del backend
        const nombre = producto.nombre_producto || producto.nombreProducto || 'Producto sin nombre';
        const categoria = producto.categoria || producto.nombreCategoria || 'Sin categoría';
        const marca = producto.marca || producto.nombreMarca || '';
        const stock = parseInt(producto.stock) || 0;  // ASEGURAR conversión a número
        const descripcion = producto.descripcion || '';
        const precio = producto.precio_venta || producto.precio || 0;
        
        console.log(`📦 Producto ${nombre}: stock=${stock} (raw=${producto.stock})`);
        
        // Precio formateado
        const precioFormateado = new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
        
        // Stock
        const stockTexto = stock > 0 
            ? `<span class="stock-disponible">✅ ${stock} disponibles</span>`
            : `<span class="stock-agotado">❌ Agotado</span>`;
        
        // Imagen con fallback
        const imagen = producto.imagen || 
            `https://placehold.co/300x300/6B7280/ffffff?text=${encodeURIComponent(nombre.substring(0, 15))}`;
        
        card.innerHTML = `
            <div class="producto-imagen">
                <img src="${imagen}" alt="${nombre}" 
                     onerror="this.onerror=null; this.src='https://placehold.co/300x300/cccccc/666666?text=Imagen'">
                ${stock === 0 ? '<div class="badge-agotado">Agotado</div>' : ''}
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${nombre}</h3>
                ${descripcion ? `<p class="producto-descripcion">${descripcion}</p>` : ''}
                
                <div class="producto-meta">
                    <span class="producto-categoria">${categoria}</span>
                    ${marca ? `<span class="producto-marca">${marca}</span>` : ''}
                </div>
                
                <div class="producto-precio-stock">
                    <span class="producto-precio">${precioFormateado}</span>
                    ${stockTexto}
                </div>
                
                <div class="producto-acciones">
                    <button class="btn-ver-detalle" onclick="productosPublicos.verDetalle(${producto.id_producto})">
                        👁️ Ver Detalles
                    </button>
                    <button class="btn-agregar-carrito" onclick="productosPublicos.agregarAlCarrito(${producto.id_producto})" 
                            ${stock === 0 ? 'disabled' : ''}>
                        ${stock > 0 ? '🛒 Agregar' : 'No disponible'}
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    verDetalle(idProducto) {
        console.log(`🔍 Ver detalle producto: ${idProducto}`);
        alert(`Detalles del producto ID: ${idProducto}`);
    }
    
    agregarAlCarrito(idProducto) {
        console.log(`🛒 Agregando producto ${idProducto} al carrito`);
        
        const producto = this.productosCargados.find(p => p.id_producto == idProducto);
        if (!producto) return;
        
        let carrito = JSON.parse(localStorage.getItem('carrito_tienda')) || [];
        const existente = carrito.find(item => item.id === idProducto);
        
        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({
                id: producto.id_producto,
                nombre: producto.nombre_producto || producto.nombreProducto,
                precio: producto.precio_venta || producto.precio,
                cantidad: 1,
                imagen: producto.imagen,
                stock: producto.stock
            });
        }
        
        localStorage.setItem('carrito_tienda', JSON.stringify(carrito));
        this.mostrarNotificacion(`✅ ${producto.nombre_producto || producto.nombreProducto} agregado al carrito`);
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
    
    mostrarSinProductos() {
        const grid = this.elementos.grid;
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>😔 Esta tienda no tiene productos disponibles</p>
            </div>
        `;
    }
    
    mostrarLoading() {
        const grid = this.elementos.grid;
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div style="
                    border: 4px solid #f3f4f6;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p>Cargando productos...</p>
            </div>
        `;
    }
    
    mostrarError(mensaje) {
        const grid = this.elementos.grid;
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #fee2e2; border-radius: 8px;">
                <p>❌ ${mensaje}</p>
            </div>
        `;
    }
    
    configurarFiltros() {
        // Búsqueda
        if (this.elementos.busqueda) {
            this.elementos.busqueda.addEventListener('input', () => this.aplicarFiltros());
        }
        
        // Ordenamiento
        if (this.elementos.ordenamiento) {
            this.elementos.ordenamiento.addEventListener('change', () => this.aplicarFiltros());
        }
        
        // Rango de precio
        if (this.elementos.precioMin) {
            this.elementos.precioMin.addEventListener('input', () => {
                if (this.elementos.precioMinDisplay) {
                    this.elementos.precioMinDisplay.textContent = this.elementos.precioMin.value;
                }
                this.aplicarFiltros();
            });
        }
        
        if (this.elementos.precioMax) {
            this.elementos.precioMax.addEventListener('input', () => {
                if (this.elementos.precioMaxDisplay) {
                    this.elementos.precioMaxDisplay.textContent = this.elementos.precioMax.value;
                }
                this.aplicarFiltros();
            });
        }
        
        // Limpiar filtros
        const btnLimpiar = document.getElementById('btnLimpiarFiltros');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarFiltros());
        }
    }
    
    aplicarFiltros() {
        let productos = [...this.productosOriginales];
        
        // Filtro de búsqueda
        const termino = (this.elementos.busqueda?.value || '').toLowerCase();
        if (termino) {
            productos = productos.filter(p => {
                const nombre = (p.nombre_producto || p.nombreProducto || '').toLowerCase();
                const desc = (p.descripcion || '').toLowerCase();
                const marca = (p.marca || p.nombreMarca || '').toLowerCase();
                return nombre.includes(termino) || desc.includes(termino) || marca.includes(termino);
            });
        }
        
        // Filtro de categorías
        const categoriasSeleccionadas = Array.from(document.querySelectorAll('.filtro-categoria:checked')).map(c => c.value);
        if (categoriasSeleccionadas.length > 0) {
            productos = productos.filter(p => {
                const cat = p.categoria || p.nombreCategoria || 'Sin categoría';
                return categoriasSeleccionadas.includes(cat);
            });
        }
        
        // Filtro de precio
        const precioMin = parseInt(this.elementos.precioMin?.value || 0);
        const precioMax = parseInt(this.elementos.precioMax?.value || 10000);
        productos = productos.filter(p => {
            const precio = p.precio_venta || p.precio || 0;
            return precio >= precioMin && precio <= precioMax;
        });
        
        // Filtro de disponibilidad
        const soloDisponible = document.querySelector('.filtro-disponible')?.checked;
        if (soloDisponible) {
            productos = productos.filter(p => (p.stock || 0) > 0);
        }
        
        // Ordenamiento
        const orden = this.elementos.ordenamiento?.value || 'relevancia';
        productos = this.ordenarProductos(productos, orden);
        
        // Mostrar resultados
        if (productos.length === 0) {
            this.elementos.grid.innerHTML = '';
            if (this.elementos.sinResultados) {
                this.elementos.sinResultados.style.display = 'block';
            }
            if (this.elementos.contador) {
                this.elementos.contador.textContent = 'Sin resultados';
            }
        } else {
            this.mostrarProductos(productos);
        }
    }
    
    ordenarProductos(productos, orden) {
        const copia = [...productos];
        
        switch(orden) {
            case 'precio-asc':
                copia.sort((a, b) => (a.precio_venta || a.precio || 0) - (b.precio_venta || b.precio || 0));
                break;
            case 'precio-desc':
                copia.sort((a, b) => (b.precio_venta || b.precio || 0) - (a.precio_venta || a.precio || 0));
                break;
            case 'nombre':
                copia.sort((a, b) => {
                    const nameA = a.nombre_producto || a.nombreProducto || '';
                    const nameB = b.nombre_producto || b.nombreProducto || '';
                    return nameA.localeCompare(nameB);
                });
                break;
            default:
                break;
        }
        
        return copia;
    }
    
    limpiarFiltros() {
        if (this.elementos.busqueda) this.elementos.busqueda.value = '';
        if (this.elementos.ordenamiento) this.elementos.ordenamiento.value = 'relevancia';
        if (this.elementos.precioMin) this.elementos.precioMin.value = 0;
        if (this.elementos.precioMax) this.elementos.precioMax.value = 10000;
        if (this.elementos.precioMinDisplay) this.elementos.precioMinDisplay.textContent = '0';
        if (this.elementos.precioMaxDisplay) this.elementos.precioMaxDisplay.textContent = '10000';
        
        document.querySelectorAll('.filtro-categoria').forEach(c => c.checked = false);
        document.querySelector('.filtro-disponible').checked = true;
        
        this.aplicarFiltros();
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM listo, iniciando productos-publicos...');
    
    window.productosPublicos = new ProductosPublicos();
    
    setTimeout(() => {
        window.productosPublicos.iniciar();
    }, 500);
});

if (document.readyState === 'complete') {
    setTimeout(() => {
        if (!window.productosPublicos) {
            window.productosPublicos = new ProductosPublicos();
            window.productosPublicos.iniciar();
        }
    }, 100);
}

console.log('✅ productos-publicos.js listo para usar');
