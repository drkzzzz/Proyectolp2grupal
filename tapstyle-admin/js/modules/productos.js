/* js/modules/productos.js
 * Módulo de productos (vista + controlador) usando datos en memoria.
 * Arquitectura ligera: ProductService (data), ProductView (render), ProductController (events).
 */

(function () {
  // --- Data layer (single responsibility) ---
  const ProductService = (function () {
    // Usamos la variable global MOCK_PRODUCTOS para desarrollo
    let products = Array.isArray(window.MOCK_PRODUCTOS)
      ? [...window.MOCK_PRODUCTOS]
      : [];

    function getAll() {
      return Promise.resolve(products);
    }

    function create(product) {
      const id = products.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
      const newProduct = Object.assign({ id }, product);
      products.push(newProduct);
      return Promise.resolve(newProduct);
    }

    function update(id, changes) {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1)
        return Promise.reject(new Error("Producto no encontrado"));
      products[idx] = Object.assign({}, products[idx], changes);
      return Promise.resolve(products[idx]);
    }

    function remove(id) {
      products = products.filter((p) => p.id !== id);
      return Promise.resolve();
    }

    return { getAll, create, update, remove };
  })();

  // --- View layer (presentación) ---
  const ProductView = (function () {
    // Renderizamos el toolbar y la tabla dentro del contenedor específico
    // del módulo para mantener el título y la descripción fuera del toolbar.
    const $container = $(".productos-module");

    function renderToolbar() {
      const html = `
				<div class="productos-toolbar">
					<div class="toolbar-left">
						<button id="btn-nuevo-producto" class="ts-btn ts-btn-primary">Crear Nuevo</button>
					</div>
					<div class="toolbar-right">
						<input id="productos-search" placeholder="Buscar por nombre, sku o marca" />
					</div>
				</div>
			`;
      $container.prepend(html);
    }

    function renderTable(products) {
      const rows = products
        .map(
          (p) => `
				<tr data-id="${p.id}">
					<td class="td-image"><img src="${p.image}" alt="${p.name}" /></td>
					<td>${p.name}<div class="muted small">SKU: ${p.sku} • ${p.brand}</div></td>
					<td>${p.category}</td>
					<td>${window.UI ? window.UI.formatCurrency(p.price) : p.price}</td>
					<td>${p.stock}</td>
          <td class="td-actions">
            <button class="ts-btn ts-btn-secondary ts-btn-sm btn-edit">Editar</button>
            <button class="ts-btn ts-btn-danger ts-btn-sm btn-delete">Eliminar</button>
          </td>
				</tr>
			`
        )
        .join("");

      const tableHtml = `
				<div class="productos-table-container">
					<table class="ts-table">
						<thead>
							<tr>
								<th></th>
								<th>Producto</th>
								<th>Categoría</th>
								<th>Precio</th>
								<th>Stock</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							${rows}
						</tbody>
					</table>
				</div>
			`;

      // Reemplazar o añadir
      const $existing = $container.find(".productos-table-container");
      if ($existing.length) {
        $existing.replaceWith(tableHtml);
      } else {
        $container.append(tableHtml);
      }
    }

    return { renderToolbar, renderTable };
  })();

  // --- Controller (orquestador) ---
  const ProductController = (function (service, view) {
    let cached = [];

    function init() {
      // Render toolbar primero para que esté en el DOM antes de cualquier acción
      view.renderToolbar();
      bindEvents();
      loadAndRender();
    }

    function loadAndRender() {
      service.getAll().then((list) => {
        cached = list;
        view.renderTable(list);
      });
    }

    function bindEvents() {
      const $main = $("main");

      $main.on("click", "#btn-nuevo-producto", () => openCreateModal());

      $main.on("input", "#productos-search", function () {
        const q = $(this).val().trim().toLowerCase();
        const filtered = cached.filter((p) => {
          return (
            p.name.toLowerCase().includes(q) ||
            (p.sku || "").toLowerCase().includes(q) ||
            (p.brand || "").toLowerCase().includes(q)
          );
        });
        view.renderTable(filtered);
      });

      $main.on("click", ".btn-delete", function () {
        const id = parseInt($(this).closest("tr").data("id"), 10);
        if (confirm("¿Eliminar producto? Esta acción no se puede deshacer.")) {
          service.remove(id).then(() => {
            UI.showToast("Producto eliminado", "info");
            loadAndRender();
          });
        }
      });

      $main.on("click", ".btn-edit", function () {
        const id = parseInt($(this).closest("tr").data("id"), 10);
        const product = cached.find((p) => p.id === id);
        openEditModal(product);
      });
    }

    function openCreateModal() {
      const body = `
				<div class="form-row"><label>Nombre</label><input id="p-name" /></div>
				<div class="form-row"><label>SKU</label><input id="p-sku" /></div>
				<div class="form-row"><label>Marca</label><input id="p-brand" /></div>
				<div class="form-row"><label>Categoría</label><input id="p-category" /></div>
				<div class="form-row"><label>Precio</label><input id="p-price" type="number" step="0.01" /></div>
				<div class="form-row"><label>Stock</label><input id="p-stock" type="number" /></div>
				<div class="form-row"><label>Imagen (URL)</label><input id="p-image" /></div>
				<div class="form-row"><label>Descripción</label><textarea id="p-desc"></textarea></div>
			`;

      const modal = UI.createModal({
        title: "Crear producto",
        body,
        onSave: ($body) => {
          const product = {
            name: $body.find("#p-name").val(),
            sku: $body.find("#p-sku").val(),
            brand: $body.find("#p-brand").val(),
            category: $body.find("#p-category").val(),
            price: parseFloat($body.find("#p-price").val()) || 0,
            stock: parseInt($body.find("#p-stock").val(), 10) || 0,
            image:
              $body.find("#p-image").val() || "https://via.placeholder.com/80",
            description: $body.find("#p-desc").val() || "",
          };

          service.create(product).then((created) => {
            UI.showToast("Producto creado", "success");
            modal.close();
            loadAndRender();
          });
        },
      });
    }

    function openEditModal(product) {
      const body = `
				<div class="form-row"><label>Nombre</label><input id="p-name" value="${product.name}" /></div>
				<div class="form-row"><label>SKU</label><input id="p-sku" value="${product.sku}" /></div>
				<div class="form-row"><label>Marca</label><input id="p-brand" value="${product.brand}" /></div>
				<div class="form-row"><label>Categoría</label><input id="p-category" value="${product.category}" /></div>
				<div class="form-row"><label>Precio</label><input id="p-price" type="number" step="0.01" value="${product.price}" /></div>
				<div class="form-row"><label>Stock</label><input id="p-stock" type="number" value="${product.stock}" /></div>
				<div class="form-row"><label>Imagen (URL)</label><input id="p-image" value="${product.image}" /></div>
				<div class="form-row"><label>Descripción</label><textarea id="p-desc">${product.description}</textarea></div>
			`;

      const modal = UI.createModal({
        title: "Editar producto",
        body,
        onSave: ($body) => {
          const changes = {
            name: $body.find("#p-name").val(),
            sku: $body.find("#p-sku").val(),
            brand: $body.find("#p-brand").val(),
            category: $body.find("#p-category").val(),
            price: parseFloat($body.find("#p-price").val()) || 0,
            stock: parseInt($body.find("#p-stock").val(), 10) || 0,
            image:
              $body.find("#p-image").val() || "https://via.placeholder.com/80",
            description: $body.find("#p-desc").val() || "",
          };

          service.update(product.id, changes).then(() => {
            UI.showToast("Producto actualizado", "success");
            modal.close();
            loadAndRender();
          });
        },
      });
    }

    return { init };
  })(ProductService, ProductView);

  // Inicializar cuando el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    ProductController.init();
  });
})();
