const ApiClient = {
  async login(identifier, password) {
    const res = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: identifier, contraseña: password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const payload = await res.json();
    const data = payload.data || {};
    const token = data.token;
    if (token) Auth.handleLoginSuccess(token);
    return data;
  },
};