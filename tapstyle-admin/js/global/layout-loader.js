/**
 * layout-loader.js
 * * Carga componentes de layout reutilizables (como sidebar y navbar)
 * en los contenedores designados.
 * * Utiliza fetch() nativo, async/await y Promise.all para una
 * carga paralela y eficiente.
 */

/**
 * Función principal que se ejecuta cuando el DOM está listo.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Definimos aquí todos los componentes que queremos cargar.
  // Esto hace que sea fácil agregar o quitar partes del layout.
  const layoutComponents = [
    {
      selector: "#sidebar-container",
      url: "_layout/_sidebar.html",
    },
    {
      selector: "#navbar-container",
      url: "_layout/_navbar.html",
    },
    // Puedes agregar más aquí, ej:
    // {
    //     selector: "#footer-container",
    //     url: "/_layout/_footer.html"
    // }
  ];

  // Usamos Promise.all para que todas las peticiones fetch()
  // se ejecuten en paralelo, en lugar de una tras otra.
  // Esto es mucho más rápido.
  Promise.all(
    layoutComponents.map((component) =>
      loadLayoutComponent(component.selector, component.url)
    )
  )
    .then(() => {
      console.log(
        "Todos los componentes del layout han sido cargados (sin caché)."
      );
      highlightCurrentSidebarLink();

      // Adjuntar el evento de logout DESPUÉS de que el sidebar se ha cargado
      const $logoutButton = $("#logout-button");

      if ($logoutButton.length) {
        $logoutButton.on("click", function (e) {
          e.preventDefault(); // Evita que el enlace href="#" navegue

          // Llama a la función de logout que ya tenemos en auth.js
          Auth.logout();
        });
      }
    })
    .catch((error) => {
      console.error("Error general al cargar el layout:", error);
    });
});

/**
 * Carga un único componente de HTML en un elemento del DOM.
 * * @param {string} selector - El selector CSS (ej. "#sidebar-container")
 * @param {string} url - La ruta al archivo HTML (ej. "/_layout/_sidebar.html")
 * @returns {Promise<void>}
 */
async function loadLayoutComponent(selector, url) {
  // 1. Encontrar el elemento contenedor en la página actual
  const element = document.querySelector(selector);

  // 2. Comprobar si el contenedor existe en esta página
  // (Importante: el login.html no tendrá sidebar, así que esto es normal)
  if (!element) {
    // No es un error, simplemente esta página no usa este componente.
    // console.log(`Contenedor "${selector}" no encontrado. Omitiendo carga de ${url}.`);
    return; // Salir de la función sin error
  }

  try {
    // 3. Hacer la petición para obtener el HTML
    const response = await fetch(url, { cache: "no-cache" });

    // 4. Manejar errores HTTP (ej. 404 - Archivo No Encontrado)
    if (!response.ok) {
      throw new Error(
        `Error al cargar ${url}: ${response.status} ${response.statusText}`
      );
    }

    // 5. Obtener el contenido HTML como texto
    const html = await response.text();

    // 6. Inyectar el HTML en el contenedor
    element.innerHTML = html;
  } catch (error) {
    // 7. Manejar errores de red o cualquier otro fallo
    console.error(
      `No se pudo cargar el componente desde ${url} en ${selector}:`,
      error
    );
    // Opcional: Mostrar un error al usuario administrador
    element.innerHTML = `<p style="color: red; padding: 1rem;">
            Error: No se pudo cargar el componente "${url}".
        </p>`;
  }
}

/**
 * Opcional: Función para resaltar el enlace activo en el sidebar.
 * Compara la URL actual con los enlaces del sidebar.
 */
function highlightCurrentSidebarLink() {
  const currentPath = window.location.pathname;

  // Usamos querySelectorAll en el contenedor que YA cargamos
  const sidebarLinks = document.querySelectorAll("#sidebar-container a");

  sidebarLinks.forEach((link) => {
    // Comprobar si el href del enlace coincide con la ruta actual
    if (link.pathname === currentPath) {
      link.classList.add("active"); // Asume que tienes una clase CSS "active"
    }
  });
}
