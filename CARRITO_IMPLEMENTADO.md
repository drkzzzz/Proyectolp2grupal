# 🛒 SISTEMA DE CARRITO DE COMPRAS - TAPSTYLE

## ✅ COMPLETADO

Se ha implementado un **sistema completo de carrito de compras y checkout** para la plataforma TapStyle.

---

## 📦 LO QUE SE IMPLEMENTÓ

### 1. **Base de Datos**
- ✅ Tablas creadas en `carrito_pedidos_schema.sql`:
  - `carritos` - Carritos de compra por usuario y empresa
  - `items_carrito` - Items individuales del carrito
  - `pedidos_clientes` - Pedidos realizados
  - `detalles_pedido_cliente` - Detalles de cada pedido
  - `pagos_pedido` - Registros de pagos

### 2. **Backend (Java/Spring Boot)**

#### Modelos:
- `Carrito.java`
- `ItemCarrito.java`
- `PedidoCliente.java`
- `DetallePedidoCliente.java`
- `PagoPedido.java`

#### DTOs:
- `CarritoDTO.java`
- `ItemCarritoDTO.java`
- `PedidoClienteDTO.java`
- `DetallePedidoClienteDTO.java`
- `PagoPedidoDTO.java`
- `AgregarAlCarritoRequest.java`
- `CheckoutRequest.java`

#### Repositorios:
- `CarritoRepository.java`
- `ItemCarritoRepository.java`
- `PedidoClienteRepository.java`
- `DetallePedidoClienteRepository.java`
- `PagoPedidoRepository.java`

#### Servicios:
- `CarritoService.java` - Lógica de carrito
- `PedidoClienteService.java` - Lógica de pedidos

#### Controladores:
- `CarritoController.java` - Endpoints del carrito
- `PedidoClienteController.java` - Endpoints de pedidos

### 3. **Frontend (HTML/JS/CSS)**

#### Páginas:
- `tienda.html` - Vista de productos (actualizada con carrito)
- `carrito.html` - Página del carrito
- `checkout.html` - Página de pago
- `confirmacion.html` - Confirmación de pedido
- `mis-pedidos.html` - Historial de pedidos

#### Scripts:
- `carrito-module.js` - Módulo principal del carrito
- `carrito-tienda.js` - Lógica de la página del carrito
- `checkout.js` - Lógica del checkout
- `mis-pedidos.js` - Lógica de mis pedidos
- `productos-tienda.js` - Actualizado para integrar carrito

---

## 🚀 CÓMO PROBAR

### Paso 1: Crear las Tablas en la Base de Datos

```sql
-- Ejecuta el archivo: carrito_pedidos_schema.sql
```

Este script creará todas las tablas necesarias para el sistema de carrito.

### Paso 2: Iniciar el Backend

```bash
cd backend
mvnw spring-boot:run
```

El backend debe estar corriendo en `http://localhost:8080`

### Paso 3: Verificar que tienes datos de prueba

Asegúrate de tener:
- ✅ Empresas con productos
- ✅ Variantes de productos con stock
- ✅ Métodos de pago configurados (tabla `tipo_pago`)
- ✅ Usuario de prueba registrado

### Paso 4: Probar el Flujo Completo

1. **Abrir la tienda:**
   - Navegar a `frontend/tienda-negocio/tienda.html`
   - Iniciar sesión con un usuario

2. **Ver productos:**
   - Los productos de la empresa se cargan automáticamente
   - Hacer clic en "Ver Detalle" de un producto

3. **Agregar al carrito:**
   - En el modal del producto, seleccionar cantidad
   - Clic en "Agregar al Carrito"
   - Ver el contador del carrito incrementarse

4. **Ver carrito:**
   - Clic en el botón del carrito (🛒)
   - Se abre `carrito.html` con los productos
   - Puedes actualizar cantidades o eliminar items

5. **Proceder al pago:**
   - Clic en "Proceder al Pago"
   - Se abre `checkout.html`

6. **Completar checkout:**
   - Llenar dirección y teléfono
   - Seleccionar método de pago
   - Clic en "Confirmar Pedido"

7. **Ver confirmación:**
   - Se muestra `confirmacion.html`
   - Aparece el número de pedido

8. **Ver historial:**
   - Ir a "Mis Pedidos" desde el menú
   - Se muestra el historial completo

---

## 📝 ENDPOINTS DEL BACKEND

### Carrito

```
GET    /api/carrito?idUsuario={id}&idEmpresa={id}
POST   /api/carrito/agregar
PUT    /api/carrito/item/{idItemCarrito}?cantidad={cantidad}
DELETE /api/carrito/item/{idItemCarrito}
DELETE /api/carrito/{idCarrito}/vaciar
```

### Pedidos

```
POST   /api/pedidos-clientes/checkout
GET    /api/pedidos-clientes/usuario/{idUsuario}
GET    /api/pedidos-clientes/empresa/{idEmpresa}
GET    /api/pedidos-clientes/{idPedido}
PUT    /api/pedidos-clientes/{idPedido}/estado?estado={estado}
```

---

## 🔧 FUNCIONALIDADES IMPLEMENTADAS

### Carrito:
✅ Agregar productos al carrito
✅ Actualizar cantidades
✅ Eliminar productos del carrito
✅ Vaciar carrito completo
✅ Validación de stock disponible
✅ Cálculo automático de subtotal, IGV y total
✅ Contador de items en la navbar
✅ Persistencia por usuario y empresa

### Checkout:
✅ Formulario de dirección y teléfono
✅ Selección de método de pago
✅ Campo de referencia para Yape/Plin/Transferencia
✅ Resumen del pedido
✅ Validaciones completas
✅ Creación del pedido en BD
✅ Conversión del carrito a pedido
✅ Página de confirmación

### Pedidos:
✅ Historial de pedidos del usuario
✅ Vista detallada de cada pedido
✅ Estados: Pendiente, Procesando, Completado, Cancelado
✅ Información de envío
✅ Detalles de productos y precios

---

## 🎨 CARACTERÍSTICAS ESPECIALES

1. **Validación de Stock:** El sistema verifica stock disponible antes de agregar al carrito
2. **Multi-tenant:** Cada carrito está asociado a un usuario Y una empresa
3. **IGV Automático:** Se calcula el 18% de IGV automáticamente
4. **Notificaciones:** Mensajes de éxito/error con animaciones
5. **Responsive:** Diseño adaptable a móviles y tablets
6. **UX Pulida:** Animaciones, transiciones y feedback visual

---

## 📱 FLUJO DE USUARIO

```
[Tienda] → [Ver Producto] → [Agregar al Carrito]
    ↓
[Carrito] → [Revisar Items] → [Actualizar/Eliminar]
    ↓
[Checkout] → [Datos de Envío] → [Método de Pago]
    ↓
[Confirmar] → [Pedido Creado] → [Confirmación]
    ↓
[Mis Pedidos] → [Ver Historial]
```

---

## 🔐 SEGURIDAD

- ✅ Validación de usuario autenticado
- ✅ Asociación carrito-usuario-empresa
- ✅ Validación de stock
- ✅ Validación de datos en backend
- ✅ Protección contra carritos huérfanos

---

## 🎯 PRÓXIMOS PASOS (OPCIONAL)

1. Integración con pasarelas de pago reales (Mercado Pago, Culqi, etc.)
2. Envío de emails de confirmación
3. Seguimiento de pedidos en tiempo real
4. Sistema de cupones y descuentos
5. Wishlist (lista de deseos)
6. Reseñas y calificaciones de productos

---

## 📞 SOPORTE

Si encuentras algún problema:
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador (F12)
3. Verifica que las tablas existan en la BD
4. Asegúrate de tener datos de prueba

---

**¡El sistema está 100% funcional y listo para usar! 🎉**
