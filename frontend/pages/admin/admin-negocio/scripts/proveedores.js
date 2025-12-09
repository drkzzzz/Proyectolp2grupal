/**
 * PROVEEDORES.JS - Gestión de Proveedores para Admin-Negocio
 * 
 * Funciones:
 * - Cargar proveedores de la empresa
 * - Crear nuevo proveedor
 * - Editar proveedor existente
 * - Eliminar proveedor
 * - Validaciones de formulario
 */

// ============================================
// VARIABLES GLOBALES
// ============================================

let proveedorEditando = null;

// ============================================
// FUNCIONES DE CARGA
// ============================================

/**
 * Cargar todos los proveedores de la empresa
 */
async function cargarProveedores() {
    try {
        const contexto = obtenerContexto();
        console.log('🚚 Cargando proveedores para empresa:', contexto.idEmpresa);
        
        const response = await fetch(`${API_BASE_URL}/proveedores/empresa/${contexto.idEmpresa}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tapstyle_token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const resultado = await response.json();
        console.log('📦 Respuesta del servidor:', resultado);
        
        const proveedores = resultado.data || [];
        
        if (!Array.isArray(proveedores)) {
            console.warn('⚠️ La respuesta no es un array:', proveedores);
            mostrarTablaVacia();
            return;
        }

        console.log(`✅ ${proveedores.length} proveedores encontrados`);
        renderizarTablaProveedores(proveedores);

    } catch (error) {
        console.error('❌ Error cargando proveedores:', error);
        mostrarError('Error al cargar proveedores: ' + error.message);
        mostrarTablaVacia();
    }
}

/**
 * Renderizar tabla de proveedores
 */
function renderizarTablaProveedores(proveedores) {
    const tbody = document.getElementById('tablaProveedores');
    
    if (!tbody) {
        console.error('❌ No se encontró el elemento tablaProveedores');
        return;
    }

    if (proveedores.length === 0) {
        mostrarTablaVacia();
        return;
    }

    tbody.innerHTML = proveedores.map(prov => `
        <tr class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${prov.razonSocial || '-'}</div>
                <div class="text-xs text-gray-500">${prov.nombreComercial || ''}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">${prov.ruc || '-'}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${prov.rubro || '-'}</td>
            <td class="px-6 py-4 text-sm text-gray-700">
                <div>${prov.telefono || '-'}</div>
                <div class="text-xs text-gray-500">${prov.email || ''}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">${prov.direccion || '-'}</td>
            <td class="px-6 py-4 text-sm">
                <div class="flex gap-2">
                    <button 
                        onclick="editarProveedor(${prov.idProveedor})" 
                        class="text-yellow-600 hover:text-yellow-800 transition duration-150"
                        title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button 
                        onclick="eliminarProveedor(${prov.idProveedor})" 
                        class="text-red-600 hover:text-red-800 transition duration-150"
                        title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Mostrar tabla vacía
 */
function mostrarTablaVacia() {
    const tbody = document.getElementById('tablaProveedores');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center">
                    <i class="fas fa-truck text-5xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 text-lg font-medium">No hay proveedores registrados</p>
                    <p class="text-gray-400 text-sm mt-2">Haz clic en "Nuevo Proveedor" para agregar uno</p>
                </td>
            </tr>
        `;
    }
}

// ============================================
// FUNCIONES DE MODAL
// ============================================

/**
 * Abrir modal para nuevo proveedor
 */
function abrirModalProveedor() {
    proveedorEditando = null;
    
    const modal = document.getElementById('modalProveedor');
    const form = document.getElementById('formProveedor');
    const titulo = modal.querySelector('h2');
    
    if (titulo) {
        titulo.textContent = 'Nuevo Proveedor';
    }
    
    if (form) {
        form.reset();
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    console.log('📝 Modal abierto para nuevo proveedor');
}

/**
 * Cerrar modal de proveedor
 */
function cerrarModalProveedor() {
    const modal = document.getElementById('modalProveedor');
    const form = document.getElementById('formProveedor');
    
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    
    if (form) {
        form.reset();
    }
    
    proveedorEditando = null;
    
    console.log('❌ Modal cerrado');
}

// ============================================
// FUNCIONES CRUD
// ============================================

/**
 * Guardar proveedor (crear o actualizar)
 */
async function guardarProveedor(event) {
    event.preventDefault();
    
    const contexto = obtenerContexto();
    
    // Obtener datos del formulario
    const datos = {
        idEmpresa: contexto.idEmpresa,
        razonSocial: document.getElementById('razonSocial').value.trim(),
        nombreComercial: document.getElementById('nombreComercial').value.trim(),
        ruc: document.getElementById('ruc').value.trim(),
        rubro: document.getElementById('rubro').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        direccion: document.getElementById('direccion').value.trim()
    };

    // Validaciones
    if (!datos.razonSocial) {
        mostrarError('La razón social es obligatoria');
        return;
    }

    if (!datos.nombreComercial) {
        mostrarError('El nombre comercial es obligatorio');
        return;
    }

    try {
        console.log('💾 Guardando proveedor:', datos);
        
        const url = proveedorEditando 
            ? `${API_BASE_URL}/proveedores/${proveedorEditando}` 
            : `${API_BASE_URL}/proveedores`;
        
        const method = proveedorEditando ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tapstyle_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || errorData.message || 'Error al guardar');
        }

        const resultado = await response.json();
        console.log('✅ Proveedor guardado:', resultado);
        
        mostrarExito(proveedorEditando ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente');
        
        cerrarModalProveedor();
        cargarProveedores();

    } catch (error) {
        console.error('❌ Error guardando proveedor:', error);
        mostrarError('Error al guardar proveedor: ' + error.message);
    }
}

/**
 * Editar proveedor existente
 */
async function editarProveedor(id) {
    try {
        console.log('✏️ Editando proveedor:', id);
        
        const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tapstyle_token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar proveedor');
        }

        const resultado = await response.json();
        const prov = resultado.data || resultado;
        
        console.log('📋 Datos del proveedor:', prov);

        // Llenar formulario
        proveedorEditando = id;
        document.getElementById('razonSocial').value = prov.razonSocial || '';
        document.getElementById('nombreComercial').value = prov.nombreComercial || '';
        document.getElementById('ruc').value = prov.ruc || '';
        document.getElementById('rubro').value = prov.rubro || '';
        document.getElementById('telefono').value = prov.telefono || '';
        document.getElementById('email').value = prov.email || '';
        document.getElementById('direccion').value = prov.direccion || '';

        // Cambiar título del modal
        const modal = document.getElementById('modalProveedor');
        const titulo = modal.querySelector('h2');
        if (titulo) {
            titulo.textContent = 'Editar Proveedor';
        }

        // Abrir modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');

    } catch (error) {
        console.error('❌ Error cargando proveedor:', error);
        mostrarError('Error al cargar proveedor: ' + error.message);
    }
}

/**
 * Eliminar proveedor
 */
async function eliminarProveedor(id) {
    if (!confirm('¿Estás seguro de eliminar este proveedor?\n\nEsta acción no se puede deshacer.')) {
        return;
    }

    try {
        console.log('🗑️ Eliminando proveedor:', id);
        
        const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tapstyle_token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || errorData.message || 'Error al eliminar');
        }

        console.log('✅ Proveedor eliminado');
        mostrarExito('Proveedor eliminado exitosamente');
        cargarProveedores();

    } catch (error) {
        console.error('❌ Error eliminando proveedor:', error);
        mostrarError('Error al eliminar proveedor: ' + error.message);
    }
}

// ============================================
// FUNCIONES DE UI
// ============================================

/**
 * Mostrar mensaje de éxito
 */
function mostrarExito(mensaje) {
    alert('✅ ' + mensaje);
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
    alert('❌ ' + mensaje);
}

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializar módulo de proveedores
 */
function inicializarProveedores() {
    console.log('🚀 Inicializando módulo de proveedores');
    
    // Validar autenticación
    const auth = validarAutenticacion();
    if (!auth) {
        console.error('❌ Autenticación fallida');
        return;
    }

    console.log('✅ Autenticación válida, cargando proveedores...');
    cargarProveedores();
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarProveedores);
} else {
    inicializarProveedores();
}
