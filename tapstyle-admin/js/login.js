// === 1. DEFINICIÓN DE USUARIOS MOCKUP ===
const mockUsers = [
  {
    email: "admin@tienda.com",
    password: "123456",
    role: "admin_negocio",
    redirect: "dashboard.html",
  },
  {
    email: "vendedor@tienda.com",
    password: "123456",
    role: "vendedor",
    redirect: "dashboard_vendedor.html",
  }, // Aún no creada
  {
    email: "cliente@mail.com",
    password: "123456",
    role: "cliente",
    redirect: "index_cliente.html",
  }, // Aún no creada
];

// === 2. LÓGICA DE PESTAÑAS (LOGIN/REGISTER) ===
const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const formLogin = document.getElementById("form-login");
const formRegister = document.getElementById("form-register");
const errorMessage = document.getElementById("error-message");

function showLogin() {
  formLogin.classList.remove("hidden");
  formRegister.classList.add("hidden");
  tabLogin.classList.add("border-indigo-600", "text-indigo-600");
  tabLogin.classList.remove("border-transparent", "text-gray-500");
  tabRegister.classList.remove("border-indigo-600", "text-indigo-600");
  tabRegister.classList.add("border-transparent", "text-gray-500");
  errorMessage.classList.add("hidden"); // Ocultar errores al cambiar de pestaña
}

function showRegister() {
  formLogin.classList.add("hidden");
  formRegister.classList.remove("hidden");
  tabRegister.classList.add("border-indigo-600", "text-indigo-600");
  tabRegister.classList.remove("border-transparent", "text-gray-500");
  tabLogin.classList.remove("border-indigo-600", "text-indigo-600");
  tabLogin.classList.add("border-transparent", "text-gray-500");
}

tabLogin.addEventListener("click", showLogin);
tabRegister.addEventListener("click", showRegister);

// === 3. LÓGICA DE ENVÍO DE FORMULARIO (VALIDACIÓN DE ROL) ===
formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailInput = document.getElementById("email-login").value;
  const passwordInput = document.getElementById("password-login").value;

  // Buscar usuario en el array
  const user = mockUsers.find(
    (u) => u.email === emailInput && u.password === passwordInput
  );

  if (user) {
    // Éxito: Redirigir según el rol
    console.log(
      `Login exitoso como ${user.role}. Redirigiendo a ${user.redirect}`
    );
    errorMessage.classList.add("hidden");
    // IMPORTANTE: Redireccionar al archivo HTML correspondiente
    window.location.href = user.redirect;
  } else {
    // Error: Mostrar mensaje
    console.error("Credenciales incorrectas");
    errorMessage.classList.remove("hidden");
  }
});

// Simular registro (solo para no romper el flujo)
formRegister.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(
    "Registro simulado exitoso. Por favor, inicia sesión con un usuario de prueba."
  );
  showLogin(); // Volver a la pestaña de login después del registro simulado
});

// Inicializar mostrando el login
window.onload = showLogin;
