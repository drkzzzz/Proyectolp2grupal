// gestion_empresas.js - Frontend JavaScript for managing empresas

// Import API configuration
const API_BASE_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:8083/api';

// ========== DOM Elements ==========
let btnAddEmpresa;
let modal;
let modalContent;
let closeModalBtn;
let cancelModalBtn;
let formAddEmpresa;
let tableBody;

// Variables globales para filtrado
let empresasGlobal = [];

// Modal de edición/detalle
let modalEditar;
let modalEditarContent;
let closeModalEditarBtn;
let cancelModalEditarBtn;
let formEditEmpresa;
let currentEditingId = null;

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements for register modal
    btnAddEmpresa = document.getElementById('btn-add-empresa');
    modal = document.getElementById('modal-registro');
    modalContent = document.getElementById('modal-content');
    closeModalBtn = document.getElementById('close-modal');
    cancelModalBtn = document.getElementById('cancel-modal');
    formAddEmpresa = document.getElementById('form-add-empresa');
    tableBody = document.querySelector('tbody');

    // Get DOM elements for edit modal
    modalEditar = document.getElementById('modal-editar');
    modalEditarContent = document.getElementById('modal-editar-content');
    closeModalEditarBtn = document.getElementById('close-modal-editar');
    cancelModalEditarBtn = document.getElementById('cancel-modal-editar');
    formEditEmpresa = document.getElementById('form-edit-empresa');

    // Set up event listeners for register modal
    if (btnAddEmpresa) btnAddEmpresa.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (formAddEmpresa) formAddEmpresa.addEventListener('submit', handleSubmit);

    // Set up event listeners for edit modal
    if (closeModalEditarBtn) closeModalEditarBtn.addEventListener('click', closeModalEditar);
    if (cancelModalEditarBtn) cancelModalEditarBtn.addEventListener('click', closeModalEditar);
    if (formEditEmpresa) formEditEmpresa.addEventListener('submit', handleEditSubmit);

    // Close modals when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal-registro') {
                closeModal();
            }
        });
    }

    if (modalEditar) {
        modalEditar.addEventListener('click', (e) => {
            if (e.target.id === 'modal-editar') {
                closeModalEditar();
            }
        });
    }

    // Load empresas on page load
    cargarEmpresas();

    // Event listeners para filtros
    const searchInput = document.getElementById('search-empresa');
    const filtroEstado = document.getElementById('filtro-estado');

    if (searchInput) searchInput.addEventListener('input', aplicarFiltros);
    if (filtroEstado) filtroEstado.addEventListener('change', aplicarFiltros);

    // Listeners para cambio de Plan (Actualizar comisión visualmente)
    const planSelect = document.getElementById('plan-seleccion');
    const comisionInput = document.getElementById('tasa-comision');

    if (planSelect && comisionInput) {
        planSelect.addEventListener('change', (e) => {
            const planId = e.target.value;
            let comision = "15.00"; // Default Custom
            if (planId === "1") comision = "2.00"; // Básico
            if (planId === "2") comision = "1.50"; // Premium
            if (planId === "3") comision = "1.00"; // Enterprise
            comisionInput.value = comision;
        });
    }

    const editPlanSelect = document.getElementById('edit-plan-seleccion');
    const editComisionInput = document.getElementById('edit-tasa-comision');

    if (editPlanSelect && editComisionInput) {
        editPlanSelect.addEventListener('change', (e) => {
            const planId = e.target.value;
            if (!planId) return; // Si selecciona "Mantener actual", no cambiamos nada visualmente por ahora

            let comision = "15.00";
            if (planId === "1") comision = "2.00";
            if (planId === "2") comision = "1.50";
            if (planId === "3") comision = "1.00";
            editComisionInput.value = comision;
        });
    }
});

// ========== Modal Functions ==========
function openModal() {
    if (!modal || !modalContent) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeModal() {
    if (!modal || !modalContent) return;
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        if (formAddEmpresa) formAddEmpresa.reset();
    }, 300);
}

function openModalEditar(idEmpresa) {
    if (!modalEditar || !modalEditarContent) {
        console.error('Modal de edición no encontrado');
        mostrarMensaje('Error: No se pudo abrir el modal de edición', 'error');
        return;
    }

    currentEditingId = idEmpresa;
    modalEditar.classList.remove('hidden');
    setTimeout(() => {
        modalEditarContent.classList.remove('scale-95', 'opacity-0');
        modalEditarContent.classList.add('scale-100', 'opacity-100');
    }, 10);

    // Cargar datos de la empresa
    cargarDatosEmpresa(idEmpresa);
}

function closeModalEditar() {
    if (!modalEditar || !modalEditarContent) return;
    modalEditarContent.classList.remove('scale-100', 'opacity-100');
    modalEditarContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modalEditar.classList.add('hidden');
        if (formEditEmpresa) formEditEmpresa.reset();
        currentEditingId = null;
    }, 300);
}

// ========== API Functions ==========

/**
 * Cargar todas las empresas
 */



async function cargarEmpresas() {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas`);
        if (!response.ok) {
            throw new Error('Error al cargar empresas');
        }
        empresasGlobal = await response.json();
        aplicarFiltros();
    } catch (error) {
        console.error('Error cargando empresas:', error);
        mostrarMensaje('Error al cargar las empresas', 'error');
    }
}

function aplicarFiltros() {
    const textoBusqueda = document.getElementById('search-empresa')?.value.toLowerCase() || '';
    const estadoFiltro = document.getElementById('filtro-estado')?.value || 'todos';

    let empresasFiltradas = empresasGlobal.filter(empresa => {
        // Filtro por texto (Nombre o RUC)
        const cumpleTexto = (empresa.nombreTienda && empresa.nombreTienda.toLowerCase().includes(textoBusqueda)) ||
            (empresa.rucEmpresa && empresa.rucEmpresa.includes(textoBusqueda));

        // Filtro por estado
        let cumpleEstado = true;
        if (estadoFiltro === 'activa') {
            cumpleEstado = empresa.estado === true;
        } else if (estadoFiltro === 'inactiva') {
            cumpleEstado = empresa.estado === false;
        }

        return cumpleTexto && cumpleEstado;
    });

    // Actualizar contador de empresas ACTIVAS (Total en el sistema vs total filtrado? 
    // El label dice "Empresas Activas", así que contaremos las activas globales o filtradas.
    // Lo más útil es mostrar cuántas activas hay en el sistema en total, o cuántas hay en la vista actual.
    // Dado el contexto "Empresas Activas (0)", actualizaré con el total de activas en la visualización actual.

    // Contar activas en la lista FILTRADA
    const activasCount = empresasFiltradas.filter(e => e.estado === true).length;

    // O mejor, contar las activas TOTALES del sistema si el label es estático, 
    // pero si filtramos, el usuario espera ver resultados del filtro.
    // Voy a mostrar el conteo de las que se están mostrando que sean activas.
    const contadorElement = document.getElementById('total-empresas');
    if (contadorElement) {
        // Opción A: Contar solo activas visibles
        // contadorElement.textContent = activasCount;

        // Opción B: Contar todas las activas del sistema (más informativo para un dashboard)
        const totalActivasSistema = empresasGlobal.filter(e => e.estado === true).length;
        contadorElement.textContent = totalActivasSistema;
    }

    renderizarTabla(empresasFiltradas);
}

/**
 * Cargar datos de una empresa específica para edición
 */
async function cargarDatosEmpresa(idEmpresa) {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas/${idEmpresa}`);
        if (!response.ok) {
            throw new Error('Error al obtener empresa');
        }

        const empresa = await response.json();

        // Poblar el formulario con los datos
        document.getElementById('edit-empresa-id').value = empresa.idEmpresa;
        document.getElementById('edit-nombre-tienda').value = empresa.nombreTienda || '';
        document.getElementById('edit-ruc-empresa').value = empresa.rucEmpresa || '';
        document.getElementById('edit-email-contacto').value = empresa.emailContacto || '';
        document.getElementById('edit-telefono').value = empresa.telefono || '';
        document.getElementById('edit-direccion-legal').value = empresa.direccionLegal || '';
        document.getElementById('edit-estado').value = empresa.estado !== undefined ? empresa.estado.toString() : 'true';
        document.getElementById('edit-tasa-comision').value = empresa.tasaComision ? (empresa.tasaComision * 100).toFixed(2) : '15.00';

    } catch (error) {
        console.error('Error cargando datos de empresa:', error);
        mostrarMensaje('Error al cargar los datos de la empresa', 'error');
        closeModalEditar();
    }
}

/**
 * Crear empresa con administrador
 */
async function crearEmpresaConAdmin(datosCompletos) {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas/crear-con-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosCompletos)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al crear empresa');
        }

        const empresaCreada = await response.json();
        mostrarMensaje('Empresa y administrador creados exitosamente', 'success');
        closeModal();
        cargarEmpresas();
        return empresaCreada;
    } catch (error) {
        console.error('Error creando empresa:', error);
        mostrarMensaje(error.message || 'Error al crear la empresa', 'error');
        throw error;
    }
}

/**
 * Actualizar empresa
 */
async function actualizarEmpresa(idEmpresa, datosEmpresa) {
    try {
        const response = await fetch(`${API_BASE_URL}/empresas/${idEmpresa}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosEmpresa)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al actualizar empresa');
        }

        const empresaActualizada = await response.json();
        mostrarMensaje('Empresa actualizada exitosamente', 'success');
        closeModalEditar();
        cargarEmpresas();
        return empresaActualizada;
    } catch (error) {
        console.error('Error actualizando empresa:', error);
        mostrarMensaje(error.message || 'Error al actualizar la empresa', 'error');
        throw error;
    }
}

/**
 * Cambiar estado de empresa (Suspender/Activar)
 */
async function cambiarEstadoEmpresa(idEmpresa, nuevoEstado) {
    const accion = nuevoEstado ? 'activar' : 'suspender';

    if (!confirm(`¿Está seguro de que desea ${accion} esta empresa?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/empresas/${idEmpresa}/estado?activo=${nuevoEstado}`, {
            method: 'PATCH'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al cambiar estado');
        }

        const mensaje = nuevoEstado
            ? 'Empresa activada correctamente'
            : 'Empresa suspendida correctamente';
        mostrarMensaje(mensaje, 'success');
        cargarEmpresas();
    } catch (error) {
        console.error('Error cambiando estado:', error);
        mostrarMensaje(error.message || 'Error al cambiar el estado', 'error');
    }
}


// ========== Form Handling ==========

function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const datosCompletos = {
        empresa: {
            nombreTienda: formData.get('nombre_tienda'),
            rucEmpresa: formData.get('ruc_empresa'),
            direccionLegal: formData.get('direccion_legal'),
            telefono: formData.get('telefono'),
            emailContacto: formData.get('email_contacto'),
            // estado: true (default)
            // tasaComision: Default backend (0.15)
        },
        administrador: {
            nombres: formData.get('admin_nombres') || 'Admin',
            apellidos: formData.get('admin_apellidos') || formData.get('nombre_tienda'),
            email: formData.get('admin_email'),
            password: formData.get('admin_password')
        }
    };

    // Validar datos
    if (!datosCompletos.empresa.nombreTienda || !datosCompletos.empresa.rucEmpresa) {
        mostrarMensaje('Por favor complete los campos requeridos de la empresa', 'error');
        return;
    }

    if (!datosCompletos.administrador.email || !datosCompletos.administrador.password) {
        mostrarMensaje('Por favor complete los campos requeridos del administrador', 'error');
        return;
    }

    if (datosCompletos.administrador.password.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    crearEmpresaConAdmin(datosCompletos);
}

function handleEditSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const idEmpresa = formData.get('id_empresa');

    const datosEmpresa = {
        nombreTienda: formData.get('nombre_tienda'),
        rucEmpresa: formData.get('ruc_empresa'),
        direccionLegal: formData.get('direccion_legal'),
        telefono: formData.get('telefono'),
        emailContacto: formData.get('email_contacto'),
        estado: formData.get('estado') === 'true'
        // tasaComision removida
    };

    // Validar datos
    if (!datosEmpresa.nombreTienda || !datosEmpresa.rucEmpresa) {
        mostrarMensaje('Por favor complete los campos requeridos', 'error');
        return;
    }

    actualizarEmpresa(idEmpresa, datosEmpresa);
}

function renderizarTabla(empresas) {
    if (!tableBody) return;

    if (!empresas || empresas.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No hay empresas registradas
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = empresas.map(empresa => {
        const estaActiva = empresa.estado === true;

        return `
        <tr class="hover:bg-indigo-50 transition duration-100" data-id="${empresa.idEmpresa}">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${empresa.nombreTienda || 'N/A'}</div>
                <div class="text-sm text-gray-500">${empresa.emailContacto || ''}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${empresa.rucEmpresa || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${empresa.emailContacto || 'N/A'}</div>
                <div class="text-sm text-gray-500">${empresa.telefono || ''}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estaActiva
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }">${estaActiva ? 'Activa' : 'Inactiva'}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${empresa.tasaComision ? (empresa.tasaComision * 100).toFixed(2) + '%' : 'N/A'
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatearFecha(empresa.fechaRegistro)
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button title="Ver y Editar Detalles" onclick="verDetalle(${empresa.idEmpresa})" 
                    class="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition duration-150">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
                ${estaActiva ? `
                    <button title="Suspender Empresa" onclick="cambiarEstadoEmpresa(${empresa.idEmpresa}, false)" 
                        class="text-orange-600 hover:text-orange-900 p-1 rounded-full hover:bg-orange-100 transition duration-150">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                ` : `
                    <button title="Activar Empresa" onclick="cambiarEstadoEmpresa(${empresa.idEmpresa}, true)" 
                        class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                `}
            </td>
        </tr>
    `;
    }).join('');
}

// ========== Utility Functions ==========

function formatearFecha(fechaString) {
    if (!fechaString) return 'N/A';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function mostrarMensaje(mensaje, tipo = 'info') {
    if (tipo === 'error') {
        alert('❌ ' + mensaje);
    } else if (tipo === 'success') {
        alert('✅ ' + mensaje);
    } else {
        alert('ℹ️ ' + mensaje);
    }
}

// ========== Action Functions ==========

function verDetalle(idEmpresa) {
    console.log('Ver/Editar detalle de empresa:', idEmpresa);
    openModalEditar(idEmpresa);
}

// Hacer las funciones disponibles globalmente
window.verDetalle = verDetalle;
window.cambiarEstadoEmpresa = cambiarEstadoEmpresa;

