package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.*;
import com.lp2.tapstyle.model.*;
import com.lp2.tapstyle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoClienteService {

    private final PedidoClienteRepository pedidoRepository;
    private final DetallePedidoClienteRepository detalleRepository;
    private final PagoPedidoRepository pagoPedidoRepository;
    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final ClienteRepository clienteRepository;
    private final TipoPagoRepository tipoPagoRepository;
    private final VarianteProductoRepository varianteRepository;

    public PedidoClienteDTO crearPedidoDesdeCarrito(CheckoutRequest request) {
        // Obtener carrito activo
        Carrito carrito = carritoRepository
                .findByUsuario_IdUsuarioAndEmpresa_IdEmpresaAndEstado(
                        request.getIdUsuario(), request.getIdEmpresa(), "Activo")
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado o vacío"));

        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        // Calcular totales
        BigDecimal subtotal = carrito.getItems().stream()
                .map(ItemCarrito::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal igv = subtotal.multiply(new BigDecimal("0.18"));
        BigDecimal total = subtotal.add(igv);

        // Crear pedido
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Empresa empresa = empresaRepository.findById(request.getIdEmpresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        Cliente cliente = request.getIdCliente() != null ? 
                clienteRepository.findById(request.getIdCliente()).orElse(null) : null;

        String numeroPedido = generarNumeroPedido();

        PedidoCliente pedido = PedidoCliente.builder()
                .numeroPedido(numeroPedido)
                .usuario(usuario)
                .empresa(empresa)
                .cliente(cliente)
                .subtotal(subtotal)
                .igv(igv)
                .total(total)
                .estado("Pendiente")
                .direccionEnvio(request.getDireccionEnvio())
                .telefonoContacto(request.getTelefonoContacto())
                .notas(request.getNotas())
                .build();

        pedido = pedidoRepository.save(pedido);

        // Crear detalles del pedido
        for (ItemCarrito item : carrito.getItems()) {
            DetallePedidoCliente detalle = DetallePedidoCliente.builder()
                    .pedido(pedido)
                    .variante(item.getVariante())
                    .cantidad(item.getCantidad())
                    .precioUnitario(item.getPrecioUnitario())
                    .subtotalLinea(item.getSubtotal())
                    .build();
            detalleRepository.save(detalle);
        }

        // Procesar pagos
        if (request.getPagos() != null && !request.getPagos().isEmpty()) {
            for (CheckoutRequest.PagoInfo pagoInfo : request.getPagos()) {
                TipoPago tipoPago = tipoPagoRepository.findById(pagoInfo.getIdTipoPago())
                        .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

                PagoPedido pago = PagoPedido.builder()
                        .pedido(pedido)
                        .tipoPago(tipoPago)
                        .montoPagado(total)
                        .referenciaPago(pagoInfo.getReferenciaPago())
                        .estadoPago("Completado")
                        .build();
                pagoPedidoRepository.save(pago);
            }
        }

        // Marcar carrito como convertido
        carrito.setEstado("Convertido");
        carritoRepository.save(carrito);

        return convertToDTO(pedidoRepository.findById(pedido.getIdPedido()).orElseThrow());
    }

    public List<PedidoClienteDTO> obtenerPedidosPorUsuario(Integer idUsuario) {
        return pedidoRepository.findByUsuario_IdUsuarioOrderByFechaPedidoDesc(idUsuario)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PedidoClienteDTO> obtenerPedidosPorEmpresa(Integer idEmpresa) {
        return pedidoRepository.findByEmpresa_IdEmpresaOrderByFechaPedidoDesc(idEmpresa)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PedidoClienteDTO obtenerPorId(Long idPedido) {
        PedidoCliente pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return convertToDTO(pedido);
    }

    public PedidoClienteDTO actualizarEstado(Long idPedido, String nuevoEstado) {
        PedidoCliente pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(nuevoEstado);
        pedido = pedidoRepository.save(pedido);
        return convertToDTO(pedido);
    }

    private String generarNumeroPedido() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "PED-" + timestamp;
    }

    private PedidoClienteDTO convertToDTO(PedidoCliente pedido) {
        List<DetallePedidoClienteDTO> detallesDTO = pedido.getDetalles() != null ?
                pedido.getDetalles().stream()
                        .map(this::convertDetalleToDTO)
                        .collect(Collectors.toList()) : List.of();

        List<PagoPedidoDTO> pagosDTO = pedido.getPagos() != null ?
                pedido.getPagos().stream()
                        .map(this::convertPagoToDTO)
                        .collect(Collectors.toList()) : List.of();

        return PedidoClienteDTO.builder()
                .idPedido(pedido.getIdPedido())
                .numeroPedido(pedido.getNumeroPedido())
                .idUsuario(pedido.getUsuario().getIdUsuario())
                .idEmpresa(pedido.getEmpresa().getIdEmpresa())
                .idCliente(pedido.getCliente() != null ? pedido.getCliente().getIdCliente() : null)
                .fechaPedido(pedido.getFechaPedido())
                .subtotal(pedido.getSubtotal())
                .igv(pedido.getIgv())
                .total(pedido.getTotal())
                .estado(pedido.getEstado())
                .direccionEnvio(pedido.getDireccionEnvio())
                .telefonoContacto(pedido.getTelefonoContacto())
                .notas(pedido.getNotas())
                .detalles(detallesDTO)
                .pagos(pagosDTO)
                .build();
    }

    private DetallePedidoClienteDTO convertDetalleToDTO(DetallePedidoCliente detalle) {
        VarianteProducto variante = detalle.getVariante();
        Producto producto = variante.getProducto();

        return DetallePedidoClienteDTO.builder()
                .idDetalle(detalle.getIdDetalle())
                .idPedido(detalle.getPedido().getIdPedido())
                .idVariante(variante.getIdVariante())
                .cantidad(detalle.getCantidad())
                .precioUnitario(detalle.getPrecioUnitario())
                .subtotalLinea(detalle.getSubtotalLinea())
                .nombreProducto(producto.getNombreProducto())
                .nombreVariante(variante.getColor() + " / " + variante.getTalla())
                .imagenUrl(null)
                .build();
    }

    private PagoPedidoDTO convertPagoToDTO(PagoPedido pago) {
        return PagoPedidoDTO.builder()
                .idPagoPedido(pago.getIdPagoPedido())
                .idPedido(pago.getPedido().getIdPedido())
                .idTipoPago(pago.getTipoPago().getIdTipoPago())
                .nombreTipoPago(pago.getTipoPago().getTipoPago())
                .montoPagado(pago.getMontoPagado())
                .fechaPago(pago.getFechaPago())
                .referenciaPago(pago.getReferenciaPago())
                .estadoPago(pago.getEstadoPago())
                .build();
    }
}
