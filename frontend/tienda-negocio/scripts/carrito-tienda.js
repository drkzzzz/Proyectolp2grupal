// ==================================================
// PÁGINA DE CARRITO - LÓGICA
// ==================================================

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar módulo de carrito
    CarritoModule.init();
    
    // Verificar autenticación
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '../pages/cliente/login.html';
        return;
    }

    // Configurar nombre de usuario
    const btnUsuario = document.getElementById('btnUsuario');
    if (btnUsuario) {
        btnUsuario.textContent = `👤 ${usuario.nombres}`;
    }

    // Dropdown de usuario
    document.getElementById('btnUsuario')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('userDropdown');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.style.display = 'none';
    });

    // Cerrar sesión
    document.getElementById('btnCerrarSesion')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '../pages/cliente/login.html';
    });

    // Mis compras
    document.getElementById('btnMisCompras')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'mis-pedidos.html';
    });

    // Cargar y renderizar carrito
    await cargarYMostrarCarrito();

    // Botón vaciar carrito
    document.getElementById('btnVaciarCarrito')?.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            await CarritoModule.vaciarCarrito();
            await cargarYMostrarCarrito();
        }
    });

    // Botón proceder al pago
    document.getElementById('btnProcederPago')?.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
});

// Cargar y mostrar carrito
async function cargarYMostrarCarrito() {
    const carrito = await CarritoModule.cargarCarrito();
    
    if (!carrito || !carrito.items || carrito.items.length === 0) {
        mostrarCarritoVacio();
        return;
    }

    mostrarCarritoConItems(carrito);
}

// Mostrar carrito vacío
function mostrarCarritoVacio() {
    document.getElementById('carritoVacio').style.display = 'block';
    document.getElementById('carritoLayout').style.display = 'none';
    document.getElementById('btnVaciarCarrito').style.display = 'none';
}

// Mostrar carrito con items
function mostrarCarritoConItems(carrito) {
    document.getElementById('carritoVacio').style.display = 'none';
    document.getElementById('carritoLayout').style.display = 'grid';
    document.getElementById('btnVaciarCarrito').style.display = 'inline-block';

    // Renderizar items
    renderizarItems(carrito.items);

    // Actualizar resumen
    actualizarResumen(carrito);
}

// Renderizar items del carrito
function renderizarItems(items) {
    const contenedor = document.getElementById('carritoItems');
    contenedor.innerHTML = '';

    items.forEach(item => {
        const itemHTML = crearItemHTML(item);
        contenedor.appendChild(itemHTML);
    });
}

// Crear HTML para un item
function crearItemHTML(item) {
    const div = document.createElement('div');
    div.className = 'carrito-item';
    div.dataset.itemId = item.idItemCarrito;

    const imagenUrl = item.imagenUrl || 'https://via.placeholder.com/100';
    const stockWarning = item.cantidad > item.stockDisponible ? 
        `<p class="stock-warning">⚠️ Stock disponible: ${item.stockDisponible}</p>` : '';

    div.innerHTML = `
        <img src="${imagenUrl}" alt="${item.nombreProducto}" class="item-imagen" 
             onerror="this.src='https://via.placeholder.com/100'">
        
        <div class="item-info">
            <h3>${item.nombreProducto}</h3>
            <p>${item.nombreVariante}</p>
            <p style="color: #10b981; font-weight: 500;">
                Stock: ${item.stockDisponible} unidades
            </p>
            ${stockWarning}
        </div>

        <div class="item-cantidad">
            <button class="btn-cantidad" onclick="cambiarCantidad(${item.idItemCarrito}, ${item.cantidad - 1})">
                −
            </button>
            <input type="number" class="cantidad-input" 
                   value="${item.cantidad}" 
                   min="1" 
                   max="${item.stockDisponible}"
                   onchange="cambiarCantidad(${item.idItemCarrito}, this.value)">
            <button class="btn-cantidad" onclick="cambiarCantidad(${item.idItemCarrito}, ${item.cantidad + 1})">
                +
            </button>
        </div>

        <div class="item-precio">
            S/. ${item.precioUnitario.toFixed(2)}
        </div>

        <div class="item-subtotal">
            S/. ${item.subtotal.toFixed(2)}
        </div>

        <button class="btn-eliminar" onclick="eliminarItem(${item.idItemCarrito})">
            🗑️ Eliminar
        </button>
    `;

    return div;
}

// Actualizar resumen
function actualizarResumen(carrito) {
    document.getElementById('resumenSubtotal').textContent = `S/. ${carrito.subtotal.toFixed(2)}`;
    document.getElementById('resumenIgv').textContent = `S/. ${carrito.igv.toFixed(2)}`;
    document.getElementById('resumenTotal').textContent = `S/. ${carrito.total.toFixed(2)}`;
    document.getElementById('totalItems').textContent = carrito.cantidadTotal;
}

// Cambiar cantidad de un item
async function cambiarCantidad(idItemCarrito, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);
    
    if (nuevaCantidad < 1) {
        if (confirm('¿Deseas eliminar este producto del carrito?')) {
            await eliminarItem(idItemCarrito);
        }
        return;
    }

    const exito = await CarritoModule.actualizarCantidad(idItemCarrito, nuevaCantidad);
    
    if (exito) {
        await cargarYMostrarCarrito();
    }
}

// Eliminar item
async function eliminarItem(idItemCarrito) {
    if (!confirm('¿Eliminar este producto del carrito?')) {
        return;
    }

    const exito = await CarritoModule.eliminarItem(idItemCarrito);
    
    if (exito) {
        await cargarYMostrarCarrito();
    }
}

    // Eliminar del carrito
