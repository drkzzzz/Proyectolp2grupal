// js/global/auth.js

// Usamos un "espacio de nombres" (Auth) para no contaminar el global
const Auth = {
  TOKEN_KEY: "tapstyle_auth_token",

  /**
   * Guarda el token en localStorage y redirige al dashboard.
   * @param {string} token - El token JWT recibido de la API.
   */
  handleLoginSuccess: function (token) {
    localStorage.setItem(this.TOKEN_KEY, token);
    window.location.href = "dashboard.html";
  },

  /**
   * Cierra la sesión, limpia el token y redirige al login.
   * Se puede llamar desde un botón de "Cerrar Sesión".
   */
  logout: function () {
    localStorage.removeItem(this.TOKEN_KEY);
    window.location.href = "login.html";
  },

  /**
   * Revisa si el usuario ya tiene un token.
   * @returns {string | null} El token o null.
   */
  getToken: function () {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  /**
   * @returns {boolean} True si el usuario tiene un token.
   */
  isLoggedIn: function () {
    return !!this.getToken();
  },

  /**
   * Función de seguridad.
   * Si el usuario está logueado, lo redirige al dashboard.
   * (Usar en login.html)
   */
  checkAuthAndRedirect: function () {
    if (this.isLoggedIn()) {
      console.log("Usuario ya logueado. Redirigiendo a dashboard...");
      window.location.href = "dashboard.html";
    }
  },

  /**
   * Función de seguridad.
   * Si el usuario NO está logueado, lo patea al login.
   * (Usar en todas las páginas protegidas, ej. dashboard.html)
   */
  protectRoute: function () {
    if (!this.isLoggedIn()) {
      console.warn("Acceso no autorizado. Redirigiendo a login...");
      window.location.href = "login.html";
    }
  },
};
