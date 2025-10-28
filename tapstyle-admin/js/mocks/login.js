// js/mocks/login.js

const MOCK_LOGIN_SUCCESS = {
  token: "jwt-token-falso-de-prueba-123456789",
  usuario: {
    id: 1,
    nombre: "Admin Tienda",
    email: "admin@tienda.com",
  },
};

const MOCK_LOGIN_ERROR = {
  message: "Credenciales incorrectas. Por favor, inténtelo de nuevo.",
};
