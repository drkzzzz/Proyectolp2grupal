// ============================================
// TIENDAS-PUBLICAS.JS - Carga tiendas desde BD
// ============================================

class TiendasPublicas {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8083/api/public';
        this.contenedorSelector = '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4.gap-8';
        console.log('🛠️ Inicializando TiendasPublicas...');
    }

    async iniciar() {
        console.log('🚀 Iniciando carga de tiendas públicas...');
        
        try {
            // PRIMERO: Intentar desde API pública
            const tiendas = await this.cargarDesdeAPI();
            console.log(`✅ ${tiendas.length} tiendas cargadas desde API`);
            this.mostrarTiendas(tiendas);
            
        } catch (error) {
            console.warn('⚠️ No se pudo conectar a la API:', error.message);
            console.log('🔄 Usando datos de ejemplo basados en BD...');
            this.usarDatosEjemplo();
        }
    }

    async cargarDesdeAPI() {
        console.log('📡 Conectando a API en:', this.API_BASE_URL);
        
        const response = await fetch(`${this.API_BASE_URL}/tiendas-destacadas`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        console.log('📊 Estado de respuesta:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const tiendas = await response.json();
        return tiendas;
    }

    mostrarTiendas(tiendas) {
        const contenedor = document.querySelector(this.contenedorSelector);
        
        if (!contenedor) {
            console.error('❌ ERROR: No se encontró el contenedor con selector:', this.contenedorSelector);
            console.log('🔍 Búsqueda en DOM:', document.querySelectorAll('.grid'));
            return;
        }

        console.log(`🎯 Contenedor encontrado, mostrando ${tiendas.length} tiendas`);
        contenedor.innerHTML = '';

        // Temas para las tarjetas (colores)
        const temas = [
            { bg: '374151', text: 'URBANA', tipo: 'urbana' },
            { bg: '9B59B6', text: 'LUJO', tipo: 'lujo' },
            { bg: '1ABC9C', text: 'DEPORTE', tipo: 'deporte' },
            { bg: '2C3E50', text: 'FORMAL', tipo: 'formal' }
        ];

        // Crear tarjeta para cada tienda
        tiendas.forEach((tienda, index) => {
            const tema = temas[index % temas.length];
            const card = this.crearCardTienda(tienda, tema);
            contenedor.appendChild(card);
        });

        console.log(`✨ ${tiendas.length} tiendas mostradas correctamente`);
        
        // Agregar event listeners a los enlaces
        this.agregarEventListeners();
    }

    crearCardTienda(tienda, tema) {
        // Obtener datos de la tienda
        const nombre = tienda.nombre_tienda || tienda.nombre || 'Tienda Sin Nombre';
        const id = tienda.id_empresa || tienda.id || 0;
        
        
        // Crear imagen placeholder
        const nombreCodificado = encodeURIComponent(nombre.substring(0, 15));
        const imagenUrl = `https://placehold.co/400x250/${tema.bg}/ffffff?text=${nombreCodificado}`;
        
        // Generar descripción
        const descripcion = this.generarDescripcion(nombre);
        
        // 🎯 IMPORTANTE: URL CORRECTA PARA tienda.html en tienda-negocio/
        const urlTienda = `../../tienda-negocio/tienda.html?tienda_id=${id}`;
        
        console.log(`🔗 Enlace generado para ${nombre}: ${urlTienda}`);
        
        // Crear elemento de tarjeta
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 overflow-hidden';
        
        card.innerHTML = `
            <img src="${imagenUrl}" 
                 alt="Logo de ${nombre}" 
                 class="w-full h-40 object-cover"
                 onerror="this.src='https://placehold.co/400x250/cccccc/666666?text=Imagen+No+Disponible'">
            <div class="p-5">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">${nombre}</h3>
                <p class="text-gray-600 text-sm mb-4">${descripcion}</p>
                <a href="${urlTienda}" 
                   data-tienda-id="${id}"
                   data-tienda-nombre="${nombre}"
                   class="btn-visitar-tienda inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    👉 Visitar Tienda
                </a>
            </div>
        `;
        
        return card;
    }

    agregarEventListeners() {
        // Escuchar clicks en los botones "Visitar Tienda"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-visitar-tienda') || 
                e.target.closest('.btn-visitar-tienda')) {
                
                const boton = e.target.classList.contains('btn-visitar-tienda') 
                    ? e.target 
                    : e.target.closest('.btn-visitar-tienda');
                
                e.preventDefault();
                
                const tiendaId = boton.getAttribute('data-tienda-id');
                const tiendaNombre = boton.getAttribute('data-tienda-nombre');
                const url = boton.getAttribute('href');
                
                console.log(`📍 Click en tienda: ${tiendaNombre} (ID: ${tiendaId})`);
                console.log(`🔗 Navegando a: ${url}`);
                
                // Guardar ID en localStorage (por si acaso)
                localStorage.setItem('tienda_actual_id', tiendaId);
                localStorage.setItem('tienda_actual_nombre', tiendaNombre);
                
                // Navegar a la tienda
                window.location.href = url;
            }
        });
    }

    generarDescripcion(nombre) {
        if (!nombre) return 'Tienda oficial con productos de calidad garantizada.';
        
        const nombreLower = nombre.toLowerCase();
        
        if (nombreLower.includes('santis')) {
            return 'Tienda deportiva con las mejores marcas internacionales.';
        } else if (nombreLower.includes('gentle') || nombreLower.includes('elegance')) {
            return 'Moda formal y elegante para ocasiones especiales.';
        } else if (nombreLower.includes('glamour') || nombreLower.includes('time')) {
            return 'Accesorios y joyería de lujo exclusiva.';
        } else if (nombreLower.includes('performance') || nombreLower.includes('footwear')) {
            return 'Calzado técnico deportivo de alto rendimiento.';
        } else if (nombreLower.includes('street') || nombreLower.includes('vibe')) {
            return 'Moda urbana y streetwear de última tendencia.';
        } else {
            return 'Tienda oficial con productos certificados y garantía.';
        }
    }

    usarDatosEjemplo() {
        console.log('📊 Cargando datos de ejemplo...');
        
        // Datos basados en tu BD REAL
        const tiendasEjemplo = [
            {
                id_empresa: 122,
                nombre_tienda: "SANTIS",
                estado: 1,
                estado_aprobacion: "Aprobada"
            },
            {
                id_empresa: 1,
                nombre_tienda: "Gentle Elegance",
                estado: 0,
                estado_aprobacion: "Suspendida"
            },
            {
                id_empresa: 2,
                nombre_tienda: "Glamour Time", 
                estado: 0,
                estado_aprobacion: "Aprobada"
            },
            {
                id_empresa: 3,
                nombre_tienda: "Performance Footwear",
                estado: 0,
                estado_aprobacion: "Aprobada"
            }
        ];

        // Filtrar solo tiendas ACTIVAS (estado = 1) y APROBADAS
        const tiendasActivas = tiendasEjemplo.filter(t => 
            t.estado === 1 && t.estado_aprobacion === "Aprobada"
        );

        console.log(`📈 Tiendas activas encontradas: ${tiendasActivas.length}`);
        this.mostrarTiendas(tiendasActivas);
    }
}

// ============================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM completamente cargado, iniciando tiendas...');
    
    // Pequeño delay para asegurar que Tailwind esté listo
    setTimeout(() => {
        const tiendasPublicas = new TiendasPublicas();
        tiendasPublicas.iniciar();
    }, 100);
});

// También inicializar si la página se carga dinámicamente
if (document.readyState === 'loading') {
    console.log('⏳ DOM aún cargando...');
} else {
    console.log('⚡ DOM ya listo, iniciando ahora...');
    const tiendasPublicas = new TiendasPublicas();
    tiendasPublicas.iniciar();
}

// Exportar para uso en consola (debugging)
window.TiendasPublicas = TiendasPublicas;
console.log('✅ TiendasPublicas.js cargado correctamente');