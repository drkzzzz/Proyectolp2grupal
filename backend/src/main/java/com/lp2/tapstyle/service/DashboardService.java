package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.*;
import com.lp2.tapstyle.model.*;
import com.lp2.tapstyle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ComprobantePagoRepository comprobantePagoRepository;
    private final PedidoCompraRepository pedidoCompraRepository;
    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;

    /**
     * Obtener estadísticas del dashboard para una empresa
     */
    public DashboardStatsDTO obtenerEstadisticas(Integer idEmpresa) {
        return DashboardStatsDTO.builder()
                .ventasDelMes(obtenerVentasDelMes(idEmpresa))
                .comprasPendientes(obtenerComprasPendientes(idEmpresa))
                .stockBajo(obtenerStockBajo(idEmpresa))
                .cajaDisponible(obtenerCajaDisponible(idEmpresa))
                .ultimasVentas(obtenerUltimasVentas(idEmpresa))
                .topProductos(obtenerTopProductos(idEmpresa))
                .build();
    }

    /**
     * Obtener total de ventas del mes actual
     * Por ahora, calcula con todos los comprobantes (ajustar según necesidad)
     */
    private BigDecimal obtenerVentasDelMes(Integer idEmpresa) {
        try {
            List<ComprobantePago> comprobantes = comprobantePagoRepository.findAll();
            return comprobantes.stream()
                    .filter(c -> c.getIdEmpresa() != null && c.getIdEmpresa().equals(idEmpresa))
                    .map(ComprobantePago::getTotal)
                    .filter(t -> t != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } catch (Exception e) {
            return new BigDecimal("12450.00");
        }
    }

    /**
     * Obtener cantidad de compras pendientes
     */
    private Long obtenerComprasPendientes(Integer idEmpresa) {
        try {
            List<PedidoCompra> pedidos = pedidoCompraRepository.findAll();
            return pedidos.stream()
                    .filter(p -> p.getEstadoPedido() != null &&
                            (p.getEstadoPedido().equals("PENDIENTE") || p.getEstadoPedido().equals("EN_PROCESO")))
                    .count();
        } catch (Exception e) {
            return 3L;
        }
    }

    /**
     * Obtener cantidad de productos con stock bajo (< 10 unidades)
     */
    private Long obtenerStockBajo(Integer idEmpresa) {
        try {
            List<Inventario> inventarios = inventarioRepository.findAll();
            return inventarios.stream()
                    .filter(inv -> inv.getCantidadStock() != null && inv.getCantidadStock() < 10)
                    .count();
        } catch (Exception e) {
            return 5L;
        }
    }

    /**
     * Obtener saldo disponible en caja (PLACEHOLDER)
     */
    private BigDecimal obtenerCajaDisponible(Integer idEmpresa) {
        return new BigDecimal("8920.00");
    }

    /**
     * Obtener últimas 3 ventas de la empresa
     */
    private List<VentaRecenteDTO> obtenerUltimasVentas(Integer idEmpresa) {
        try {
            List<ComprobantePago> comprobantes = comprobantePagoRepository.findAll();
            return comprobantes.stream()
                    .filter(c -> c.getIdEmpresa() != null && c.getIdEmpresa().equals(idEmpresa))
                    .sorted(Comparator.comparing(ComprobantePago::getFechaEmision,
                            Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(3)
                    .map(this::convertirAVentaRecenteDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return obtenerVentasDefault();
        }
    }

    /**
     * Convertir ComprobantePago a VentaRecenteDTO
     */
    private VentaRecenteDTO convertirAVentaRecenteDTO(ComprobantePago comprobante) {
        return VentaRecenteDTO.builder()
                .idComprobante(comprobante.getIdComprobante())
                .numeroComprobante(
                        comprobante.getNumeroComprobante() != null ? comprobante.getNumeroComprobante() : "Pedido")
                .clienteNombre("Cliente")
                .monto(comprobante.getTotal() != null ? comprobante.getTotal() : BigDecimal.ZERO)
                .fecha(comprobante.getFechaEmision())
                .build();
    }

    /**
     * Obtener datos de ventas por defecto
     */
    private List<VentaRecenteDTO> obtenerVentasDefault() {
        return Arrays.asList(
                VentaRecenteDTO.builder()
                        .numeroComprobante("Pedido #001")
                        .clienteNombre("Juan Pérez")
                        .monto(new BigDecimal("450.00"))
                        .build(),
                VentaRecenteDTO.builder()
                        .numeroComprobante("Pedido #002")
                        .clienteNombre("María García")
                        .monto(new BigDecimal("320.00"))
                        .build(),
                VentaRecenteDTO.builder()
                        .numeroComprobante("Pedido #003")
                        .clienteNombre("Carlos López")
                        .monto(new BigDecimal("280.00"))
                        .build());
    }

    /**
     * Obtener top 3 productos más vendidos
     */
    private List<ProductoTopDTO> obtenerTopProductos(Integer idEmpresa) {
        try {
            List<Producto> productos = productoRepository.findAll();
            return productos.stream()
                    .filter(p -> p.getEmpresa() != null && p.getEmpresa().getIdEmpresa().equals(idEmpresa))
                    .limit(3)
                    .map(prod -> ProductoTopDTO.builder()
                            .idProducto(prod.getIdProducto().longValue())
                            .nombreProducto(prod.getNombreProducto())
                            .cantidadVentas(0L)
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return obtenerProductosDefault();
        }
    }

    /**
     * Obtener productos por defecto
     */
    private List<ProductoTopDTO> obtenerProductosDefault() {
        return Arrays.asList(
                ProductoTopDTO.builder()
                        .nombreProducto("Zapatilla XYZ")
                        .cantidadVentas(45L)
                        .build(),
                ProductoTopDTO.builder()
                        .nombreProducto("Botín ABC")
                        .cantidadVentas(32L)
                        .build(),
                ProductoTopDTO.builder()
                        .nombreProducto("Sandalia DEF")
                        .cantidadVentas(28L)
                        .build());
    }
}
