/**
 * Stock.js - Gestión de Inventario
 * Maneja la carga, actualización y ajuste de stock
 */

// Obtener token de autenticación
function obtenerToken() {
    return localStorage.getItem('tapstyle_token') || 
           localStorage.getItem('token') || 
           localStorage.getItem('authToken');
}

// Obtener contexto del usuario (empresa, usuario, etc)
function obtenerContexto() {
    const usuario = JSON.parse(localStorage.getItem('tapstyle_user') || '{}');
    const idEmpresaStr = localStorage.getItem('idEmpresa');
    const idEmpresa = idEmpresaStr ? parseInt(idEmpresaStr) : null;
    const empresaNombre = localStorage.getItem('empresaNombre') || 'Tu Empresa';
    const empresaInitials = localStorage.getItem('empresaInitials') || 'TE';

    return {
        usuario,
        idEmpresa,
        empresaNombre,
        empresaInitials,
        nombreUsuario: usuario?.nombre || 'Usuario'
    };
}

/**
 * Toggle del menú lateral
 */
function toggleMenu(button) {
    const submenu = button.nextElementSibling;
    const icon = button.querySelector('i:last-child');
    submenu.classList.toggle('hidden');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

/**
 * Cerrar sesión con confirmación
 */
function cerrarSesionConfirm() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        cerrarSesion();
    }
}

/**
 * Cargar la lista de productos para el select de ajuste
 */
async function cargarProductos() {
    try {
        const contexto = obtenerContexto();
        const empresaId = contexto.idEmpresa;
        const token = obtenerToken();
        
        console.log('📦 Cargando productos para inventario:', empresaId);

        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/productos/empresa/${empresaId}`, {
            headers
        });

        if (!response.ok) throw new Error('Error al cargar productos');

        const resultado = await response.json();
        const productos = resultado.data || resultado;

        const select = document.getElementById('idProductoAjuste');
        if (Array.isArray(productos) && productos.length > 0) {
            select.innerHTML = '<option value="">Selecciona un producto</option>' +
                productos.map(p => `<option value="${p.idProducto}">${p.nombreProducto}</option>`).join('');
        } else {
            select.innerHTML = '<option value="">No hay productos disponibles</option>';
        }
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        const select = document.getElementById('idProductoAjuste');
        select.innerHTML = '<option value="">Error al cargar productos</option>';
    }
}

/**
 * Cargar inventario con variantes
 */
async function cargarInventario() {
    try {
        const contexto = obtenerContexto();
        const empresaId = contexto.idEmpresa;
        const token = obtenerToken();
        
        console.log('📦 Cargando inventario para empresa:', empresaId);

        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/inventario/empresa/${empresaId}`, {
            headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error del servidor:', errorData);
            throw new Error(errorData.message || 'Error al cargar inventario');
        }

        const resultado = await response.json();
        console.log('📥 Respuesta inventario:', resultado);
        let inventarios = Array.isArray(resultado) ? resultado : (resultado.data || []);
        
        // Filtrar nulos
        inventarios = inventarios.filter(inv => inv && inv.nombreProducto);

        if (!Array.isArray(inventarios) || inventarios.length === 0) {
            console.warn('⚠️ No hay inventarios disponibles');
            mostrarTablaVacia();
            return;
        }

        let totalProductos = 0;
        let stockBajo = 0;
        let valorTotal = 0;

        const tbody = document.getElementById('tablaInventario');
        tbody.innerHTML = inventarios.map(item => {
            totalProductos++;
            const cantidadStock = parseInt(item.cantidadStock) || 0;
            const stockMinimo = parseInt(item.stockMinimo) || 0;
            
            // Convertir precio: puede ser string, número o BigDecimal JSON
            let precio = 0;
            if (item.precioUnitario !== null && item.precioUnitario !== undefined) {
                precio = parseFloat(item.precioUnitario);
                if (isNaN(precio)) precio = 0;
            }

            if (cantidadStock < stockMinimo) stockBajo++;

            const valorLinea = cantidadStock * precio;
            valorTotal += valorLinea;

            const estado = cantidadStock < stockMinimo ? 'bajo' : 'normal';
            const badgeClass = estado === 'bajo' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
            const estadoText = estado === 'bajo' ? '⚠ Bajo' : '✓ Normal';

            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${item.nombreProducto || 'N/A'}</td>
                    <td class="px-6 py-4 text-sm text-gray-700 font-semibold">${cantidadStock}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${stockMinimo}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}">
                            ${estadoText}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-700">$${precio.toFixed(2)}</td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-semibold">$${valorLinea.toFixed(2)}</td>
                    <td class="px-6 py-4 text-sm">
                        <button onclick="abrirAjusteProducto(${item.idProducto})" class="text-blue-600 hover:text-blue-800" title="Ajustar stock">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('totalProductos').textContent = totalProductos;
        document.getElementById('stockBajo').textContent = stockBajo;
        document.getElementById('valorTotal').textContent = `$${valorTotal.toFixed(2)}`;
        console.log(`✅ Inventario cargado: ${totalProductos} productos, valor total: $${valorTotal.toFixed(2)}`);

    } catch (error) {
        console.error('❌ Error cargando inventario:', error);
        mostrarTablaVacia();
    }
}

/**
 * Guardar ajuste de stock
 */
async function guardarAjuste(event) {
    event.preventDefault();

    const idProducto = parseInt(document.getElementById('idProductoAjuste').value);
    const tipo = document.getElementById('tipoMovimiento').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const razon = document.getElementById('razon').value;

    if (!idProducto || !tipo || !cantidad || cantidad <= 0) {
        alert('Completa los campos requeridos y la cantidad debe ser > 0');
        return;
    }

    try {
        const contexto = obtenerContexto();
        const empresaId = contexto.idEmpresa;
        const token = obtenerToken();
        
        if (!empresaId) {
            alert('Error: ID de empresa no disponible');
            return;
        }
        
        const datos = {
            idProducto: idProducto,
            cantidad: cantidad,
            tipo: tipo === 'Entrada' ? 'entrada' : 'salida',
            razon: razon || 'Ajuste manual',
            idEmpresa: empresaId
        };
        
        console.log('📤 Enviando ajuste de stock:', datos);

        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/inventario/registrar-ajuste`, {
            method: 'POST',
            headers,
            body: JSON.stringify(datos)
        });

        const responseData = await response.json();
        console.log('📥 Respuesta del servidor:', responseData);

        if (!response.ok) {
            const errorMsg = responseData?.message || responseData?.error || 'Error al guardar ajuste';
            throw new Error(errorMsg);
        }

        alert('✅ Stock ajustado correctamente');
        cerrarModalAjuste();
        cargarInventario();
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error: ' + error.message);
    }
}

/**
 * Abrir modal de ajuste para un producto específico
 */
function abrirAjusteProducto(idProducto) {
    document.getElementById('idProductoAjuste').value = idProducto;
    abrirModalAjuste();
}

/**
 * Mostrar tabla vacía
 */
function mostrarTablaVacia() {
    document.getElementById('tablaInventario').innerHTML = `
        <tr>
            <td colspan="7" class="px-6 py-8 text-center">
                <i class="fas fa-inbox text-3xl text-gray-400 mb-2"></i>
                <p class="text-gray-500">No hay productos en inventario</p>
            </td>
        </tr>
    `;
}

/**
 * Abrir modal de ajuste
 */
function abrirModalAjuste() {
    document.getElementById('modalAjuste').classList.remove('hidden');
    cargarProductos();
}

/**
 * Cerrar modal de ajuste
 */
function cerrarModalAjuste() {
    document.getElementById('modalAjuste').classList.add('hidden');
    document.getElementById('formAjuste').reset();
}

/**
 * Inicializar página cuando DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    const auth = validarAutenticacion();
    if (!auth) return;

    console.log('🚀 Inicializando módulo de Stock...');
    cargarInventario();
});
