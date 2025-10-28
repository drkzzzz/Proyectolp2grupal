// mocks/productos.js
// Datos ficticios para el módulo de productos (desarrollo sin backend)
// Asignamos explícitamente a window.MOCK_PRODUCTOS para que el código
// que lee `window.MOCK_PRODUCTOS` funcione correctamente incluso cuando
// el entorno use `const`/`let` que no crean propiedades en window.

window.MOCK_PRODUCTOS = [
  {
    id: 1,
    name: "Camiseta Indigo",
    sku: "TS-001",
    brand: "TapStyle",
    price: 29.99,
    stock: 120,
    image:
      "https://grupo3soluciones.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/g/i/gildan_5000_t_shirts_indigo.jpg",
    category: "Ropa",
    description: "Camiseta de algodón suave, fit regular.",
  },
  {
    id: 2,
    name: "Bolso Classic",
    sku: "TS-002",
    brand: "TapStyle",
    price: 59.5,
    stock: 45,
    image: "https://bubbabags.com.pe/cdn/shop/files/410156026703_1.jpg",
    category: "Accesorios",
    description: "Bolso de mano con cierre metálico.",
  },
  {
    id: 3,
    name: "Gorra Urban",
    sku: "TS-003",
    brand: "UrbanWear",
    price: 15.0,
    stock: 200,
    image:
      "https://dbz8g93w027an.cloudfront.net/212126-superlarge_default/Gorra-59Fifty-New-York-Yankees-Urban-Blue-Camo-Blue.jpg",
    category: "Accesorios",
    description: "Gorra ajustable estilo urbano.",
  },
  {
    id: 4,
    name: "Jean Slim Fit",
    sku: "TS-004",
    brand: "DenimCo",
    price: 49.99,
    stock: 60,
    image:
      "https://pieers.com/media/catalog/product/cache/334416996b13b45056f516cf8b55981c/p/p/ppr0b7t3pp9_1_1.jpg",
    category: "Ropa",
    description: "Jean para uso diario, lavado oscuro.",
  },
  {
    id: 5,
    name: "Collar Minimal",
    sku: "TS-005",
    brand: "Bijou",
    price: 22.0,
    stock: 150,
    image:
      "https://clock.pe/cdn/shop/files/DIJE_LEGACY_NEGRO_DIJ-11_COLLAR_MINIMAL_2.jpg",
    category: "Accesorios",
    description: "Collar dorado minimalista.",
  },
];

// Nota: el módulo de productos lee window.MOCK_PRODUCTOS
