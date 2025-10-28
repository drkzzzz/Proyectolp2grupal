/* ui-helpers.js
 * Funciones utilitarias de UI compartidas por los módulos.
 * Implementación ligera y sin dependencias adicionales (usa jQuery
 * si está disponible en la página).
 */

const UI = (function () {
  // Crea y muestra un modal simple. Devuelve objeto con close().
  function createModal({
    title = "",
    body = "",
    size = "md",
    onSave = null,
    saveText = "Guardar",
  } = {}) {
    // Contenedor
    const $overlay = $(
      `<div class="ts-modal-overlay"><div class="ts-modal ts-modal-${size}"><header class="ts-modal-header"><h3>${title}</h3></header><div class="ts-modal-body">${body}</div><footer class="ts-modal-footer"><button class="ts-btn ts-btn-secondary ts-modal-cancel">Cancelar</button><button class="ts-btn ts-btn-primary ts-modal-save">${saveText}</button></footer></div></div>`
    );

    // Agregar al body
    $(document.body).append($overlay);

    // Eventos
    $overlay.find(".ts-modal-cancel").on("click", () => close());
    $overlay.find(".ts-modal-save").on("click", () => {
      if (typeof onSave === "function") {
        onSave($overlay.find(".ts-modal-body"));
      }
      // no cerramos automáticamente para permitir validaciones; el callback
      // puede invocar close() si lo desea.
    });

    function close() {
      $overlay.remove();
    }

    return { close, el: $overlay };
  }

  function showToast(message, type = "info", timeout = 3000) {
    const $toast = $(`<div class="ts-toast ts-toast-${type}">${message}</div>`);
    $(document.body).append($toast);
    setTimeout(() => $toast.addClass("visible"), 10);
    setTimeout(() => $toast.removeClass("visible"), timeout - 200);
    setTimeout(() => $toast.remove(), timeout);
  }

  function formatCurrency(value) {
    try {
      return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(value);
    } catch (e) {
      return `$ ${value}`;
    }
  }

  return { createModal, showToast, formatCurrency };
})();

// Expone funciones para uso directo desde módulos
window.UI = UI;
