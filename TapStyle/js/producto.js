// js/products.js
// Usamos window para que sea una variable global accesible
window.PRODUCTS_DATA = [
    // --- ROPA ---
    {
      id: 'p1',
      name: 'Chaqueta de Cuero Vintage',
      price: 120.00,
      store: 'Street Vibe Co.',
      image: 'https://placehold.co/400x500/FEEF90/000000?text=Chaqueta',
      type: 'ropa',
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Una chaqueta de cuero clásica con un toque vintage. Perfecta para cualquier ocasión. Hecha con materiales de alta calidad.'
    },
    {
      id: 'p2',
      name: 'Vestido de Noche Elegante',
      price: 85.50,
      store: 'Gentle Elegance',
      image: 'https://placehold.co/400x500/F5A623/000000?text=Vestido',
      type: 'ropa',
      sizes: ['S', 'M', 'L'],
      description: 'Vestido elegante para eventos formales. Corte sirena que realza la figura.'
    },
    {
      id: 'p3',
      name: "Camiseta Gráfica 'Future'",
      price: 35.00,
      store: 'Street Vibe Co.',
      image: 'https://placehold.co/400x500/B8E994/000000?text=Camiseta',
      type: 'ropa',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Camiseta de algodón 100% con estampado gráfico moderno. Ideal para un look casual.'
    },
    {
      id: 'p4',
      name: 'Pantalón Jogger Casual',
      price: 45.99,
      store: 'Tienda Genérica A',
      image: 'https://placehold.co/400x500/FF6B6B/000000?text=Pantalón',
      type: 'ropa',
      sizes: ['M', 'L', 'XL'],
      description: 'Joggers cómodos y versátiles, perfectos para el día a día.'
    },
    {
      id: 'p5',
      name: 'Hoodie Premium Azul',
      price: 79.00,
      store: 'Tienda Genérica B',
      image: 'https://placehold.co/400x500/5D9CEC/000000?text=Hoodie',
      type: 'ropa',
      sizes: ['S', 'M', 'L'],
      description: 'Hoodie de alta calidad, tela gruesa y suave al tacto. Color azul intenso.'
    },

    // --- ACCESORIOS ---
    {
      id: 'a1',
      name: 'Reloj Clásico de Acero',
      price: 250.00,
      store: 'Glamour Time',
      image: 'https://placehold.co/400x500/D4D4D4/000000?text=Reloj',
      type: 'accesorio',
      sizes: [], // Array vacío significa que NO tiene tallas
      description: 'Elegancia atemporal. Este reloj de acero inoxidable complementa cualquier estilo, formal o casual.'
    },
    {
      id: 'a2',
      name: 'Collar Minimalista (Oro)',
      price: 95.00,
      store: 'Joyería Venus',
      image: 'https://placehold.co/400x500/E3B505/000000?text=Collar',
      type: 'accesorio',
      sizes: [],
      description: 'Un detalle sutil y elegante. Collar bañado en oro de 18k con un dije minimalista.'
    },
    {
      id: 'a3',
      name: 'Gafas de Sol Polarizadas',
      price: 60.00,
      store: 'Tienda Genérica C',
      image: 'https://placehold.co/400x500/C0C0C0/000000?text=Gafas',
      type: 'accesorio',
      sizes: [],
      description: 'Protección UV400 y lentes polarizadas. Estilo aviador clásico que nunca pasa de moda.'
    },
    {
      id: 'a4',
      name: 'Mochila Táctica Urbana',
      price: 49.99,
      store: 'Street Vibe Co.',
      image: 'https://placehold.co/400x500/8E44AD/000000?text=Mochila',
      type: 'accesorio',
      sizes: [],
      description: 'Mochila resistente e impermeable, con múltiples compartimentos para tu laptop y accesorios.'
    },
    {
      id: 'a5',
      name: 'Bufanda de Cachemira',
      price: 30.00,
      store: 'Tienda Genérica D',
      image: 'https://placehold.co/400x500/3498DB/000000?text=Bufanda',
      type: 'accesorio',
      sizes: [],
      description: 'Suave y cálida, esta bufanda de mezcla de cachemira es el accesorio perfecto para el invierno.'
    },
    {
      id: 'r1',
      name: 'Chaqueta Roja Deportiva',
      price: 89.99,
      store: 'Street Vibe Co.',
      image: 'https://placehold.co/400x500/DC2626/ffffff?text=Chaqueta+R',
      type: 'recomendado', // Nuevo tipo
      sizes: ['S', 'M', 'L'],
      description: 'Chaqueta deportiva ligera, ideal para correr o para un look casual.'
    },
    {
      id: 'r2',
      name: 'Zapatos Urbanos',
      price: 120.00,
      store: 'Performance Footwear',
      image: 'https://placehold.co/400x500/059669/ffffff?text=Zapatos+V',
      type: 'recomendado', // Nuevo tipo
      sizes: ['40', '41', '42', '43'],
      description: 'Zapatos cómodos con diseño urbano, perfectos para caminar todo el día.'
    },
    {
      id: 'r3',
      name: 'Gafas de Sol Premium',
      price: 75.50,
      store: 'Glamour Time',
      image: 'https://placehold.co/400x500/7C3AED/ffffff?text=Gafas+L',
      type: 'recomendado', // Nuevo tipo
      sizes: [],
      description: 'Gafas de sol con protección UV400 y un marco de acetato premium.'
    },
    {
      id: 'r4',
      name: 'Camisa Casual',
      price: 45.00,
      store: 'Gentle Elegance',
      image: 'https://placehold.co/400x500/0EA5E9/ffffff?text=Camisa+A',
      type: 'recomendado', // Nuevo tipo
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Camisa de algodón suave, corte slim fit, perfecta para la oficina o el fin de semana.'
    },
    {
      id: 'r5',
      name: 'Mochila Táctica',
      price: 55.00,
      store: 'Street Vibe Co.',
      image: 'https://placehold.co/400x500/F59E0B/ffffff?text=Mochila',
      type: 'recomendado', // Nuevo tipo
      sizes: [],
      description: 'Mochila resistente con múltiples compartimentos, ideal para el día a día o viajes cortos.'
    }
];