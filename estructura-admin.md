proyecto-admin/
│
├── login.html              # Página de inicio de sesión
├── dashboard.html          # Página principal (Home del admin)
├── usuarios.html           # Módulo de Gestión de Usuarios
├── productos.html          # Módulo de Gestión de Productos
├── pedidos.html            # Módulo de Gestión de Pedidos
├── marcas.html             # Módulo de Marcas y Modelos
├── clientes.html           # Módulo de Clientes
└── ... (y más páginas de módulos .html) ...
│
├── _layout/                # <-- Fragmentos de HTML para reusar
│   ├── _sidebar.html       # El HTML del menú lateral
│   └── _navbar.html        # El HTML de la barra de navegación superior
│
├── css/                    # <-- Todo nuestro CSS modularizado
│   ├── base/
│   │   ├── _variables.css    # Paleta de colores (Índigo), fuentes, espacios
│   │   ├── _reset.css        # Quita estilos por defecto (subrayados, márgenes)
│   │   └── _base.css         # Estilos globales (body, h1, .main-content)
│   │
│   ├── components/
│   │   ├── _button.css       # Estilos para clases como .btn, .btn-primary
│   │   ├── _card.css         # Estilos para la clase .card
│   │   ├── _table.css        # Estilos para las tablas de datos
│   │   └── _modal.css        # Estilos para los modales (pop-ups)
│   │
│   ├── layout/
│   │   ├── _sidebar.css      # Estilos *solo* para el .sidebar
│   │   ├── _navbar.css       # Estilos *solo* para el .navbar
│   │   └── _layout.css       # (Opcional) Clases de maquetación general
│   │
│   ├── modules/
│   │   ├── _login.css        # Estilos *solo* para login.html
│   │   ├── _dashboard.css    # Estilos *solo* para dashboard.html
│   │   └── _usuarios.css     # Estilos *solo* para usuarios.html
│   │
│   └── main.css            # <-- ÚNICO CSS que enlazas en tu HTML (usa @import)
│
└── js/                     # <-- Toda nuestra lógica JavaScript
    │
    ├── lib/
    │   └── jquery.min.js     # (Opcional) Librerías de terceros
    │
    ├── global/
    │   ├── config.js         # Constantes (API_BASE_URL, y el switch USE_MOCKS)
    │   ├── api-client.js     # Lógica centralizada para fetch() o $.ajax()
    │   ├── ui-helpers.js     # Funciones globales (crearModal, mostrarAlerta)
    │   ├── auth.js           # Lógica de login, tokens, y proteger rutas
    │   └── layout-loader.js  # Carga el _sidebar.html y _navbar.html
    │
    ├── mocks/                # <-- Carpeta para datos falsos (para desarrollo)
    │   ├── usuarios.js       # Declara la variable global MOCK_USUARIOS
    │   ├── productos.js      # Declara la variable global MOCK_PRODUCTOS
    │   └── pedidos.js        # Declara la variable global MOCK_PEDIDOS
    │
    └── modulos/              # <-- Lógica específica de CADA PÁGINA
        ├── login.js          # Lógica *solo* para login.html
        ├── dashboard.js      # Lógica *solo* para dashboard.html
        ├── usuarios.js       # Lógica *solo* para usuarios.html
        └── productos.js      # Lógica *solo* para productos.html