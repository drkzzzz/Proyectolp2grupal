// ================================================================
// INTEGRACIÓN DE CARRITO - Conectar productos-tienda con carrito-compra
// ================================================================

// Extender la clase ProductosTienda para usar el nuevo sistema de carrito
const ProductosTiendaCarritoIntegration = {
    
    // Sobrescribir método agregarAlCarrito
    agregarAlCarritoNuevo(idProducto) {
        console.log(`🛒 Agregando producto ${idProducto} al carrito (nuevo sistema)`);
        
        // Verificar que carritoCompra esté inicializado
        if (!carritoCompra) {
            console.error('❌ CarritoCompra no inicializado');
            alert('Error: Sistema de carrito no disponible');
            return;
        }

        // Encontrar el producto en los productos cargados
        const producto = productosTienda?.encontrarProductoPorId(idProducto);
        
        if (!producto) {
            console.error(`❌ Producto ${idProducto} no encontrado`);
            alert('Producto no encontrado');
            return;
        }

        // Obtener la primera variante del producto desde el backend
        this.obtenerVariantesDelProducto(idProducto).then(variantes => {
            let idVariante = idProducto; // Fallback al id_producto
            
            if (variantes && variantes.length > 0) {
                // Usar la primera variante disponible
                idVariante = variantes[0].id_variante || variantes[0].idVariante;
                console.log(`✅ Variante encontrada: ${idVariante}`);
            } else {
                console.warn(`⚠️ No hay variantes para producto ${idProducto}, usando ID del producto`);
            }

            // Convertir formato del producto
            const productoCarrito = {
                idProductoVariante: idVariante,
                nombreProducto: producto.nombre_producto || producto.nombreProducto,
                precio: parseFloat(producto.precio_venta || producto.precio || 0),
                cantidad: 1,
                imagen: producto.imagen || '',
                stock: parseInt(producto.stock) || 0
            };

            console.log('📦 Producto a agregar:', productoCarrito);
            
            // Usar el sistema de carrito-compra
            carritoCompra.agregarProducto(productoCarrito);
        }).catch(error => {
            console.warn(`⚠️ No se pudieron obtener variantes, usando ID de producto: ${error.message}`);
            // Fallback: usar id_producto directamente
            const productoCarrito = {
                idProductoVariante: idProducto,
                nombreProducto: producto.nombre_producto || producto.nombreProducto,
                precio: parseFloat(producto.precio_venta || producto.precio || 0),
                cantidad: 1,
                imagen: producto.imagen || '',
                stock: parseInt(producto.stock) || 0
            };
            carritoCompra.agregarProducto(productoCarrito);
        });
    },
    
    // Obtener variantes de un producto desde el backend
    async obtenerVariantesDelProducto(idProducto) {
        try {
            const apiBase = window.API_CONFIG?.BASE_URL || 'http://localhost:8083/api';
            const response = await fetch(`${apiBase}/variantes/producto/${idProducto}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tapstyle_token') || ''}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const variantes = data.data || data;
                if (variantes && variantes.length > 0) {
                    return variantes;
                }
            }
            
            // Si no encuentra variantes del producto, obtén una variante genérica
            console.warn(`⚠️ Sin variantes para producto ${idProducto}, obteniendo variante genérica...`);
            return await this.obtenerVarianteGenerica();
        } catch (error) {
            console.warn(`Error obteniendo variantes: ${error.message}`);
            // Fallback: obtener variante genérica
            return await this.obtenerVarianteGenerica();
        }
    },
    
    // Obtener la primera variante disponible del sistema
    async obtenerVarianteGenerica() {
        try {
            const apiBase = window.API_CONFIG?.BASE_URL || 'http://localhost:8083/api';
            const response = await fetch(`${apiBase}/variantes`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tapstyle_token') || ''}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const variantes = data.data || data;
                if (variantes && variantes.length > 0) {
                    console.log(`✅ Variante genérica obtenida: ${variantes[0].id_variante || variantes[0].idVariante}`);
                    return variantes;
                }
            }
            return [];
        } catch (error) {
            console.error(`Error obteniendo variante genérica: ${error.message}`);
            return [];
        }
    },

    // Inicializar integración
    init() {
        if (typeof productosTienda === 'undefined') {
            console.warn('⚠️ ProductosTienda no cargado aún, reintentando en 500ms...');
            setTimeout(() => this.init(), 500);
            return;
        }

        if (typeof carritoCompra === 'undefined' || !carritoCompra) {
            console.warn('⚠️ CarritoCompra no inicializado aún, reintentando en 500ms...');
            setTimeout(() => this.init(), 500);
            return;
        }

        console.log('✅ ProductosTienda y CarritoCompra están listos');
        
        // Sobrescribir el método original - usando bind para mantener contexto
        const original = productosTienda.agregarAlCarrito.bind(productosTienda);
        
        productosTienda.agregarAlCarrito = (idProducto) => {
            console.log(`🔄 Método agregarAlCarrito interceptado para producto ${idProducto}`);
            ProductosTiendaCarritoIntegration.agregarAlCarritoNuevo(idProducto);
        };

        console.log('✅ Integración de carrito activada - método agregarAlCarrito sobrescrito');
    }
};

// Iniciar integración cuando todo esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que ambos estén listos
    setTimeout(() => {
        console.log('🔧 Inicializando integración de carrito...');
        
        // IMPORTANTE: Migrar datos de carrito_tienda a carrito_items si existe
        const carritoTienda = localStorage.getItem('carrito_tienda');
        if (carritoTienda) {
            try {
                const items = JSON.parse(carritoTienda);
                console.log('📦 Encontrado carrito_tienda con', items.length, 'items');
                console.log('📦 Contenido:', items);
                
                // Convertir items a formato correcto (necesitan variantes)
                // Por ahora, vamos a mostrar una advertencia
                console.warn('⚠️ NOTA: carrito_tienda fue encontrado pero será REEMPLAZADO por carrito_items');
                console.warn('⚠️ Por favor, agregue productos nuevamente con las variantes correctas');
                
                // Limpiar carrito_tienda para evitar conflictos
                // localStorage.removeItem('carrito_tienda');
            } catch(e) {
                console.error('Error al parsear carrito_tienda:', e);
            }
        }
        
        ProductosTiendaCarritoIntegration.init();
    }, 500);
});
