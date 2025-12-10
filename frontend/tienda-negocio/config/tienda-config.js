// ============================================
// CONFIGURACIÓN DE TIENDA - VERSIÓN CORREGIDA
// ============================================

console.log('🎯 CONFIGURACIÓN DE TIENDA INICIADA');
console.log('📍 URL actual:', window.location.href);
console.log('📌 Pathname:', window.location.pathname);
console.log('🔍 Search:', window.location.search);

// ============================================
// 1. FUNCIÓN MEJORADA PARA OBTENER ID DE TIENDA
// ============================================

function obtenerIdTiendaDeURL() {
    console.log('\n🔍 BUSCANDO ID DE TIENDA...');
    
    // OPCIÓN 1: Parámetros GET directos
    const urlParams = new URLSearchParams(window.location.search);
    console.log('📋 Todos los parámetros GET:', Object.fromEntries(urlParams.entries()));
    
    let tiendaId = null;
    
    // Buscar en diferentes nombres de parámetro
    const posiblesNombres = ['tienda_id', 'id_tienda', 'id', 'empresa_id', 'store_id'];
    
    for (const nombre of posiblesNombres) {
        const valor = urlParams.get(nombre);
        if (valor) {
            tiendaId = valor;
            console.log(`✅ ID encontrado en parámetro "${nombre}":`, tiendaId);
            break;
        }
    }
    
    // OPCIÓN 2: Extraer de fragmento de URL (#)
    if (!tiendaId && window.location.hash) {
        console.log('🔍 Buscando en hash:', window.location.hash);
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
        const hashId = hashParams.get('tienda_id') || hashParams.get('id');
        if (hashId) {
            tiendaId = hashId;
            console.log('✅ ID encontrado en hash:', tiendaId);
        }
    }
    
    // OPCIÓN 3: Extraer de la ruta del archivo
    if (!tiendaId) {
        const pathParts = window.location.pathname.split('/');
        console.log('🔍 Partes de la ruta:', pathParts);
        
        // Buscar números en la ruta
        for (const part of pathParts) {
            const match = part.match(/(\d+)/);
            if (match && match[1]) {
                tiendaId = match[1];
                console.log('✅ ID extraído de ruta:', tiendaId);
                break;
            }
        }
    }
    
    // OPCIÓN 4: Usar localStorage (de clic anterior)
    if (!tiendaId) {
        tiendaId = localStorage.getItem('tienda_actual_id');
        if (tiendaId) {
            console.log('✅ ID recuperado de localStorage:', tiendaId);
        }
    }
    
    // OPCIÓN 5: Valor por defecto (DEBUG)
    if (!tiendaId) {
        // PREGUNTA: ¿Qué ID debería usar por defecto?
        tiendaId = '122'; // SANTIS
        console.log('⚠️ Usando ID por defecto (DEBUG):', tiendaId);
    }
    
    // Convertir a número y validar
    const idNumero = parseInt(tiendaId);
    if (isNaN(idNumero) || idNumero <= 0) {
        console.error('❌ ID inválido detectado:', tiendaId);
        console.log('🔄 Usando fallback seguro...');
        return 122; // SANTIS como fallback
    }
    
    console.log('🎯 ID FINAL DE TIENDA:', idNumero);
    
    // Guardar para futuras referencias
    localStorage.setItem('tienda_actual_id', idNumero.toString());
    localStorage.setItem('tienda_url_completa', window.location.href);
    
    return idNumero;
}

// ============================================
// 2. CONFIGURACIÓN PRINCIPAL
// ============================================

const TIENDA_CONFIG = {
    // Propiedades
    ID_TIENDA: null,
    NOMBRE_TIENDA: 'Cargando...',
    DATOS_TIENDA: null,
    API_BASE_URL: 'http://localhost:8083/api',
    DEBUG_MODE: true,
    
    // Método de inicialización
    inicializar: function() {
        console.log('\n🏪 INICIALIZANDO CONFIGURACIÓN DE TIENDA');
        
        // 1. Obtener ID
        this.ID_TIENDA = obtenerIdTiendaDeURL();
        console.log(`📋 ID establecido: ${this.ID_TIENDA}`);
        
        // 2. Configurar como global
        window.ID_TIENDA_ACTUAL = this.ID_TIENDA;
        window.CONFIG_TIENDA = this;
        
        // 3. Actualizar UI inmediatamente
        this.actualizarUIInmediata();
        
        // 4. Cargar datos asíncronamente
        this.cargarDatosTienda();
        
        // 5. Verificar productos
        this.verificarProductosTienda();
    },
    
    // Actualizar UI sin esperar datos
    actualizarUIInmediata: function() {
        console.log('🎨 Actualizando UI inmediata...');
        
        // Título de la página
        document.title = `Tienda ${this.ID_TIENDA} - TapStyle`;
        
        // Navbar
        const nombreElement = document.getElementById('tiendaNombre');
        if (nombreElement) {
            nombreElement.textContent = `Tienda ${this.ID_TIENDA}`;
            nombreElement.setAttribute('data-tienda-id', this.ID_TIENDA);
        }
        
        // Info de tienda
        const infoElement = document.getElementById('tiendaInfo');
        if (infoElement) {
            infoElement.innerHTML = `
                <div class="tienda-loading">
                    <h2>🔄 Cargando Tienda #${this.ID_TIENDA}</h2>
                    <p>Obteniendo información...</p>
                </div>
            `;
        }
        
        // Mostrar ID en consola para debug
        console.log(`🏷️ UI actualizada para tienda ID: ${this.ID_TIENDA}`);
    },
    
    // Cargar datos desde API
    cargarDatosTienda: async function() {
        console.log(`\n📡 SOLICITANDO DATOS DE TIENDA ${this.ID_TIENDA}`);
        
        try {
            // OPCIÓN A: Endpoint público (si existe)
            let endpoint = `${this.API_BASE_URL}/public/tiendas/${this.ID_TIENDA}`;
            console.log('🌐 Intentando endpoint público:', endpoint);
            
            let response = await fetch(endpoint, {
                headers: { 'Accept': 'application/json' },
                timeout: 5000
            });
            
            // OPCIÓN B: Endpoint con autenticación
            if (!response || !response.ok) {
                console.log('🔑 Intentando con autenticación...');
                const token = localStorage.getItem('tapstyle_token');
                
                endpoint = `${this.API_BASE_URL}/empresas/${this.ID_TIENDA}`;
                response = await fetch(endpoint, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
            }
            
            // OPCIÓN C: Datos mock si todo falla
            if (!response || !response.ok) {
                console.warn('⚠️ API no disponible, usando datos mock');
                this.usarDatosMock();
                return;
            }
            
            // Procesar respuesta exitosa
            const datos = await response.json();
            console.log('✅ Datos recibidos:', datos);
            
            this.DATOS_TIENDA = datos;
            this.NOMBRE_TIENDA = datos.nombre_tienda || datos.nombre || `Tienda ${this.ID_TIENDA}`;
            
            // Actualizar UI con datos reales
            this.actualizarUICompleta();
            
        } catch (error) {
            console.error('❌ Error crítico:', error);
            this.usarDatosMock();
        }
    },
    
    // Usar datos mock cuando la API falla
    usarDatosMock: function() {
        console.log('🛠️ Creando datos mock...');
        
        // Datos basados en IDs conocidos
        const datosPorID = {
            122: {
                nombre_tienda: "SANTIS",
                telefono: "345678213",
                email_contacto: "san@gmail.com",
                direccion_legal: "Jr. Peru 456",
                descripcion: "Tienda deportiva oficial"
            },
            1: {
                nombre_tienda: "Gentle Elegance",
                telefono: "987654321",
                email_contacto: "info@tapstyle-ge.com",
                direccion_legal: "Jr. Fashion #101, Lima, Perú",
                descripcion: "Moda formal y elegante"
            },
            2: {
                nombre_tienda: "Glamour Time",
                telefono: "987654322",
                email_contacto: "info@tapstyle-gt.com",
                direccion_legal: "Av. Style #202, Lima, Perú",
                descripcion: "Accesorios y joyería de lujo"
            },
            3: {
                nombre_tienda: "Performance Footwear",
                telefono: "987654323",
                email_contacto: "info@tapstyle-pf.com",
                direccion_legal: "Calle Deporte #303, Lima, Perú",
                descripcion: "Calzado deportivo técnico"
            },
            4: {
                nombre_tienda: "Street Vibe",
                telefono: "987654324",
                email_contacto: "info@tapstyle-sv.com",
                direccion_legal: "Av. Urban #404, Lima, Perú",
                descripcion: "Moda urbana y streetwear"
            }
        };
        
        this.DATOS_TIENDA = datosPorID[this.ID_TIENDA] || {
            nombre_tienda: `Tienda ${this.ID_TIENDA}`,
            telefono: "No disponible",
            email_contacto: "No disponible",
            direccion_legal: "Dirección no disponible",
            descripcion: "Tienda oficial en TapStyle"
        };
        
        this.NOMBRE_TIENDA = this.DATOS_TIENDA.nombre_tienda;
        
        console.log('✅ Datos mock creados:', this.DATOS_TIENDA);
        this.actualizarUICompleta();
    },
    
    // Actualizar UI con datos completos
    actualizarUICompleta: function() {
        console.log('✨ Actualizando UI completa...');
        
        // 1. Título de página
        document.title = `${this.NOMBRE_TIENDA} - TapStyle`;
        
        // 2. Navbar
        const nombreElement = document.getElementById('tiendaNombre');
        if (nombreElement) {
            nombreElement.textContent = this.NOMBRE_TIENDA;
            nombreElement.title = `ID: ${this.ID_TIENDA}`;
        }
        
        // 3. Información principal
        const infoElement = document.getElementById('tiendaInfo');
        if (infoElement) {
            infoElement.innerHTML = `
                <div class="tienda-header-detalle">
                    <h1 class="tienda-titulo-principal">${this.NOMBRE_TIENDA}</h1>
                    <div class="tienda-datos-contacto">
                        ${this.DATOS_TIENDA.telefono ? `<div class="dato-contacto">📞 ${this.DATOS_TIENDA.telefono}</div>` : ''}
                        ${this.DATOS_TIENDA.email_contacto ? `<div class="dato-contacto">✉️ ${this.DATOS_TIENDA.email_contacto}</div>` : ''}
                        ${this.DATOS_TIENDA.direccion_legal ? `<div class="dato-contacto">📍 ${this.DATOS_TIENDA.direccion_legal}</div>` : ''}
                    </div>
                    <p class="tienda-descripcion-detalle">${this.DATOS_TIENDA.descripcion}</p>
                    <div class="tienda-meta-info">
                        <span class="tienda-id-badge">ID: ${this.ID_TIENDA}</span>
                        <span class="tienda-estado-badge">✅ Tienda Verificada</span>
                    </div>
                </div>
            `;
        }
        
        // 4. Log en consola
        console.log(`✅ UI actualizada para: ${this.NOMBRE_TIENDA} (ID: ${this.ID_TIENDA})`);
        
        // 5. Disparar evento personalizado
        this.dispararEventoTiendaCargada();
    },
    
    // Verificar productos de esta tienda
    verificarProductosTienda: function() {
        console.log(`\n📦 VERIFICANDO PRODUCTOS PARA TIENDA ${this.ID_TIENDA}`);
        
        // Este método será llamado por productos-tienda.js
        // Solo registrar por ahora
        console.log('✅ Sistema listo para cargar productos de esta tienda');
        
        // Crear variable global para que otros scripts la usen
        window.TIENDA_ID_PARA_PRODUCTOS = this.ID_TIENDA;
    },
    
    // Evento personalizado cuando la tienda está lista
    dispararEventoTiendaCargada: function() {
        const event = new CustomEvent('tiendaCargada', {
            detail: {
                id: this.ID_TIENDA,
                nombre: this.NOMBRE_TIENDA,
                datos: this.DATOS_TIENDA,
                timestamp: new Date().toISOString()
            }
        });
        
        document.dispatchEvent(event);
        console.log('🎉 Evento "tiendaCargada" disparado');
    },
    
    // Método de ayuda para debug
    debugInfo: function() {
        console.log('\n🔍 DEBUG INFO - TIENDA_CONFIG');
        console.log('ID:', this.ID_TIENDA);
        console.log('Nombre:', this.NOMBRE_TIENDA);
        console.log('URL actual:', window.location.href);
        console.log('LocalStorage ID:', localStorage.getItem('tienda_actual_id'));
        console.log('Datos:', this.DATOS_TIENDA);
    }
};

// ============================================
// 3. INICIALIZACIÓN AUTOMÁTICA
// ============================================

// Opción 1: Si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('\n📄 DOM LISTO - Iniciando configuración...');
        TIENDA_CONFIG.inicializar();
    });
} else {
    // Opción 2: DOM ya está listo
    console.log('\n⚡ DOM YA LISTO - Iniciando ahora...');
    setTimeout(() => TIENDA_CONFIG.inicializar(), 100);
}

// ============================================
// 4. HACER DISPONIBLE GLOBALMENTE
// ============================================

window.TIENDA_CONFIG = TIENDA_CONFIG;
window.obtenerIdTiendaActual = () => TIENDA_CONFIG.ID_TIENDA;
window.obtenerNombreTiendaActual = () => TIENDA_CONFIG.NOMBRE_TIENDA;

console.log('✅ tienda-config.js cargado completamente');
console.log('💡 Usa TIENDA_CONFIG.debugInfo() para ver información');

// ============================================
// 5. FUNCIÓN DE EMERGENCIA SI TODO FALLA
// ============================================

function forzarIdTienda(id) {
    console.warn(`🚨 FORZANDO ID DE TIENDA: ${id}`);
    TIENDA_CONFIG.ID_TIENDA = parseInt(id) || 122;
    localStorage.setItem('tienda_actual_id', TIENDA_CONFIG.ID_TIENDA.toString());
    TIENDA_CONFIG.actualizarUIInmediata();
    return TIENDA_CONFIG.ID_TIENDA;
}

window.forzarIdTienda = forzarIdTienda;