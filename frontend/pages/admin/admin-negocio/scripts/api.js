/**
 * API.JS - Funciones centralizadas para llamadas al backend
 * 
 * Proporciona:
 * - getRequest() - GET simplificado
 * - postRequest() - POST con contexto automático
 * - putRequest() - PUT con contexto automático
 * - deleteRequest() - DELETE
 * - Manejo de errores consistente
 * - Inyección automática de idEmpresa e idUsuario
 */

const API_BASE_URL = 'http://localhost:8083/api';

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtener headers con token de autenticación
 */
function obtenerHeaders(extras = {}) {
    const token = localStorage.getItem('tapstyle_token');
    
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...extras
    };
}

/**
 * Obtener contexto automático (idEmpresa, idUsuario)
 */
function obtenerContextoAutomatico() {
    const usuario = JSON.parse(localStorage.getItem('tapstyle_user'));
    const idEmpresa = parseInt(localStorage.getItem('idEmpresa'));

    return {
        idEmpresa,
        idUsuario: usuario?.idUsuario
    };
}

/**
 * Manejar errores HTTP consistentemente
 */
async function manejarError(response, endpoint) {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            const mensaje = errorData.mensaje || errorData.message || 'Error desconocido';
            throw new Error(`Error ${response.status}: ${mensaje}`);
        } catch (e) {
            throw new Error(`Error ${response.status} en ${endpoint}`);
        }
    }
    return response;
}

// ============================================
// OPERACIONES GET
// ============================================

/**
 * GET - Obtener datos
 * @param {string} endpoint - Ruta sin /api (ej: 'productos')
 * @param {object} parametros - Parámetros de query
 * @returns {Promise}
 */
async function getRequest(endpoint, parametros = {}) {
    try {
        // Construir URL con parámetros
        const url = new URL(`${API_BASE_URL}/${endpoint}`);
        
        // Agregar parámetros
        Object.keys(parametros).forEach(key => {
            url.searchParams.append(key, parametros[key]);
        });

        console.log(`📡 GET ${url.toString()}`);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: obtenerHeaders()
        });

        await manejarError(response, endpoint);
        const data = await response.json();
        
        console.log(`✅ GET ${endpoint} exitoso:`, data);
        return data;

    } catch (error) {
        console.error(`❌ Error en GET ${endpoint}:`, error);
        throw error;
    }
}

/**
 * GET - Obtener por ID
 */
async function getRequestPorId(endpoint, id) {
    return getRequest(`${endpoint}/${id}`);
}

// ============================================
// OPERACIONES POST
// ============================================

/**
 * POST - Crear nuevo recurso
 * Inyecta automáticamente idEmpresa e idUsuario
 * @param {string} endpoint - Ruta sin /api
 * @param {object} datos - Datos a enviar
 * @returns {Promise}
 */
async function postRequest(endpoint, datos = {}) {
    try {
        // Inyectar contexto automático
        const contexto = obtenerContextoAutomatico();
        const datosCompletos = {
            ...contexto,
            ...datos
        };

        console.log(`📡 POST ${endpoint}`, datosCompletos);

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: obtenerHeaders(),
            body: JSON.stringify(datosCompletos)
        });

        await manejarError(response, endpoint);
        const data = await response.json();
        
        console.log(`✅ POST ${endpoint} exitoso:`, data);
        return data;

    } catch (error) {
        console.error(`❌ Error en POST ${endpoint}:`, error);
        throw error;
    }
}

/**
 * POST sin contexto automático (si se necesita)
 */
async function postRequestSinContexto(endpoint, datos = {}) {
    try {
        console.log(`📡 POST ${endpoint}`, datos);

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: obtenerHeaders(),
            body: JSON.stringify(datos)
        });

        await manejarError(response, endpoint);
        const data = await response.json();
        
        console.log(`✅ POST ${endpoint} exitoso:`, data);
        return data;

    } catch (error) {
        console.error(`❌ Error en POST ${endpoint}:`, error);
        throw error;
    }
}

// ============================================
// OPERACIONES PUT
// ============================================

/**
 * PUT - Actualizar recurso
 * Inyecta automáticamente idEmpresa e idUsuario
 */
async function putRequest(endpoint, id, datos = {}) {
    try {
        const contexto = obtenerContextoAutomatico();
        const datosCompletos = {
            ...contexto,
            ...datos,
            id
        };

        console.log(`📡 PUT ${endpoint}/${id}`, datosCompletos);

        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: obtenerHeaders(),
            body: JSON.stringify(datosCompletos)
        });

        await manejarError(response, endpoint);
        const data = await response.json();
        
        console.log(`✅ PUT ${endpoint}/${id} exitoso:`, data);
        return data;

    } catch (error) {
        console.error(`❌ Error en PUT ${endpoint}/${id}:`, error);
        throw error;
    }
}

// ============================================
// OPERACIONES DELETE
// ============================================

/**
 * DELETE - Eliminar recurso
 */
async function deleteRequest(endpoint, id) {
    try {
        console.log(`📡 DELETE ${endpoint}/${id}`);

        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
            method: 'DELETE',
            headers: obtenerHeaders()
        });

        await manejarError(response, endpoint);
        
        // Algunos DELETE no retornan JSON
        if (response.status === 204) {
            console.log(`✅ DELETE ${endpoint}/${id} exitoso (sin contenido)`);
            return { success: true };
        }

        const data = await response.json();
        console.log(`✅ DELETE ${endpoint}/${id} exitoso:`, data);
        return data;

    } catch (error) {
        console.error(`❌ Error en DELETE ${endpoint}/${id}:`, error);
        throw error;
    }
}

// ============================================
// FUNCIONES ESPECÍFICAS POR MÓDULO
// ============================================

/**
 * PRODUCTOS
 */
const productoAPI = {
    listar: (filtros = {}) => getRequest('productos', { idEmpresa: obtenerContextoAutomatico().idEmpresa, ...filtros }),
    obtener: (id) => getRequestPorId('productos', id),
    crear: (datos) => postRequest('productos', datos),
    actualizar: (id, datos) => putRequest('productos', id, datos),
    eliminar: (id) => deleteRequest('productos', id)
};

/**
 * COMPRAS
 */
const comprasAPI = {
    listar: (filtros = {}) => getRequest('pedidos-compra', { idEmpresa: obtenerContextoAutomatico().idEmpresa, ...filtros }),
    obtener: (id) => getRequestPorId('pedidos-compra', id),
    crear: (datos) => postRequest('pedidos-compra', datos),
    actualizar: (id, datos) => putRequest('pedidos-compra', id, datos),
    eliminar: (id) => deleteRequest('pedidos-compra', id)
};

/**
 * VENTAS
 */
const ventasAPI = {
    listar: (filtros = {}) => getRequest('pedidos', { idEmpresa: obtenerContextoAutomatico().idEmpresa, ...filtros }),
    obtener: (id) => getRequestPorId('pedidos', id),
    crear: (datos) => postRequest('pedidos', datos),
    actualizar: (id, datos) => putRequest('pedidos', id, datos),
    eliminar: (id) => deleteRequest('pedidos', id)
};

/**
 * INVENTARIO
 */
const inventarioAPI = {
    listar: () => getRequest('inventario', { idEmpresa: obtenerContextoAutomatico().idEmpresa }),
    obtener: (id) => getRequestPorId('inventario', id),
    ajustar: (idProducto, cantidad, tipo) => postRequest('inventario/ajustar', { idProducto, cantidad, tipo })
};

/**
 * EMPLEADOS
 */
const empleadosAPI = {
    listar: () => getRequest('usuarios', { idEmpresa: obtenerContextoAutomatico().idEmpresa, rol: 'empleado' }),
    obtener: (id) => getRequestPorId('usuarios', id),
    crear: (datos) => postRequest('usuarios', datos),
    actualizar: (id, datos) => putRequest('usuarios', id, datos),
    eliminar: (id) => deleteRequest('usuarios', id)
};

/**
 * CLIENTES
 */
const clientesAPI = {
    listar: () => getRequest('clientes', { idEmpresa: obtenerContextoAutomatico().idEmpresa }),
    obtener: (id) => getRequestPorId('clientes', id)
};

/**
 * CAJA
 */
const cajaAPI = {
    obtenerSaldo: () => getRequest('caja/saldo', { idEmpresa: obtenerContextoAutomatico().idEmpresa }),
    listarMovimientos: (filtros = {}) => getRequest('caja/movimientos', { idEmpresa: obtenerContextoAutomatico().idEmpresa, ...filtros }),
    registrarMovimiento: (datos) => postRequest('caja/movimientos', datos)
};

/**
 * FINANZAS
 */
const finanzasAPI = {
    obtenerReporte: () => getRequest('finanzas/reporte', { idEmpresa: obtenerContextoAutomatico().idEmpresa }),
    cuentasPorCobrar: () => getRequest('finanzas/cuentas-por-cobrar', { idEmpresa: obtenerContextoAutomatico().idEmpresa }),
    cuentasPorPagar: () => getRequest('finanzas/cuentas-por-pagar', { idEmpresa: obtenerContextoAutomatico().idEmpresa })
};

// ============================================
// FUNCIONES UTILITARIAS DE FORMULARIO
// ============================================

/**
 * Mostrar loading en un botón mientras se procesa
 */
function mostrarLoading(botón, texto = 'Procesando...') {
    botón.disabled = true;
    botón.setAttribute('data-original-text', botón.textContent);
    botón.textContent = texto;
}

/**
 * Ocultar loading en un botón
 */
function ocultarLoading(botón) {
    botón.disabled = false;
    botón.textContent = botón.getAttribute('data-original-text') || 'Guardar';
}

/**
 * Mostrar notificación de éxito
 */
function mostrarExito(mensaje = 'Operación exitosa') {
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => notificacion.remove(), 3000);
}

/**
 * Mostrar notificación de error
 */
function mostrarError(mensaje = 'Ocurrió un error') {
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => notificacion.remove(), 4000);
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getRequest,
        getRequestPorId,
        postRequest,
        postRequestSinContexto,
        putRequest,
        deleteRequest,
        productoAPI,
        comprasAPI,
        ventasAPI,
        inventarioAPI,
        empleadosAPI,
        clientesAPI,
        cajaAPI,
        finanzasAPI,
        mostrarExito,
        mostrarError,
        mostrarLoading,
        ocultarLoading
    };
}
