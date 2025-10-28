// js/modules/login.js

$(document).ready(function () {
  // 1. VERIFICACIÓN INICIAL: Si ya está logueado, ¡fuera de aquí!
  Auth.checkAuthAndRedirect();

  // 2. Cachear selectores de jQuery
  const $loginForm = $("#login-form");
  const $emailInput = $("#email-input");
  const $passwordInput = $("#password-input");
  const $submitButton = $("#submit-button");
  const $errorMsg = $("#login-error-msg");

  // 3. Manejador del evento de envío
  $loginForm.on("submit", function (event) {
    event.preventDefault(); // Evitar que la página se recargue

    const email = $emailInput.val().trim();
    const password = $passwordInput.val().trim();

    // 4. Validación simple de cliente
    if (!email || !password) {
      $errorMsg.text("Por favor, ingrese correo y contraseña.");
      return;
    }

    // 5. Iniciar estado de carga
    setLoading(true);

    // 6. Decidir si usar Mocks o API Real
    if (CONFIG.USE_MOCKS) {
      // Simular una llamada a la API (Mock)
      setTimeout(() => {
        if (email === "admin@tienda.com" && password === "123456") {
          // Éxito: Usamos el Auth helper
          Auth.handleLoginSuccess(MOCK_LOGIN_SUCCESS.token);
        } else {
          // Error: Mostramos el error mock
          handleLoginError(MOCK_LOGIN_ERROR.message);
        }
      }, 1500); // Simular 1.5 segundos de carga
    } else {
      // Llamada a la API REAL (requiere api-client.js)
      ApiClient.post(CONFIG.API_ENDPOINTS.LOGIN, { email, password })
        .then((response) => {
          // Éxito: Usamos el Auth helper
          Auth.handleLoginSuccess(response.token);
        })
        .catch((error) => {
          // Error: Mostramos el error de la API
          handleLoginError(error.message || "Error inesperado del servidor.");
        });
    }
  });

  /**
   * Activa o desactiva el estado de carga del formulario
   * @param {boolean} isLoading - True para mostrar carga, false para estado normal
   */
  function setLoading(isLoading) {
    if (isLoading) {
      $submitButton.prop("disabled", true).text("Cargando...");
      $errorMsg.text(""); // Limpiar errores
    } else {
      $submitButton.prop("disabled", false).text("Ingresar");
    }
  }

  /**
   * Muestra un mensaje de error y resetea el estado de carga
   * @param {string} message - El mensaje de error a mostrar
   */
  function handleLoginError(message) {
    setLoading(false);
    $errorMsg.text(message);
  }
});
