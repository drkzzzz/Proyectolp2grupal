/**
 * PRODUCTOS TIENDA - Versión simple
 * Solo encargado de mostrar productos y agregar al carrito simple
 */

class ProductosTiendaSimple {
    constructor() {
        this.API_BASE = 'http://localhost:8083/api';
        this.idEmpresa = this.obtenerIdEmpresa();
        this.init();
    }
    
    obtenerIdEmpresa() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('tienda_id')) || 122;
    }
    
    init() {
        console.log('🏪 Inicializando tienda de productos...');
        this.cargarProductos();
    }
    
    // Cargar productos del servidor
    async cargarProductos() {
        try {
            const res = await fetch(`${this.API_BASE}/productos/empresa/${this.idEmpresa}`);
            const data = await res.json();
            const productos = data.data || data || [];
            
            console.log(`📦 Productos cargados: ${productos.length}`);
            this.mostrarProductos(productos);
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            alert('Error al cargar productos');
        }
    }
    
    // Mostrar productos en el HTML
    mostrarProductos(productos) {
        const contenedor = document.getElementById('productosGrid');
        if (!contenedor) {
            console.warn('⚠️ No encontré #productosGrid en el HTML');
            return;
        }
        
        contenedor.innerHTML = '';
        
        productos.forEach(producto => {
            // Obtener primer variante para los detalles
            const primerVariante = producto.variantes && producto.variantes.length > 0 
                ? producto.variantes[0] 
                : null;
            
            if (!primerVariante) return; // Skip si no tiene variantes
            
            const card = document.createElement('div');
            card.className = 'producto-card';
            card.innerHTML = `
                <div class="producto-imagen">
                    <img src="${producto.imagen || 'https://via.placeholder.com/200?text=Producto'}" 
                         alt="${producto.nombreProducto}">
                </div>
                <div class="producto-info">
                    <h4>${producto.nombreProducto}</h4>
                    <p class="descripcion">${producto.descripcion || 'Sin descripción'}</p>
                    <div class="detalle-variante">
                        <p><small>Talla: ${primerVariante.talla}</small></p>
                        <p><small>Color: ${primerVariante.color}</small></p>
                    </div>
                    <p class="precio">S/. ${primerVariante.precioVenta.toFixed(2)}</p>
                    <button class="btn btn-primary" 
                        onclick="tienda.agregarAlCarrito(${primerVariante.idVariante}, 
                                                          '${producto.nombreProducto}', 
                                                          ${primerVariante.precioVenta}, 
                                                          '${producto.imagen || ''}')">
                        🛒 Agregar al Carrito
                    </button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    }
    
    // Agregar producto al carrito
    agregarAlCarrito(idVariante, nombre, precio, imagen) {
        if (typeof carrito === 'undefined') {
            alert('❌ Error: carrito no inicializado');
            return;
        }
        
        carrito.agregar(idVariante, nombre, precio, imagen);
    }
}

// Instancia global
let tienda;
document.addEventListener('DOMContentLoaded', () => {
    tienda = new ProductosTiendaSimple();
});
