package com.lp2.tapstyle.service;

import com.lp2.tapstyle.dto.PedidoCompraDTO;
import com.lp2.tapstyle.model.PedidoCompra;
import com.lp2.tapstyle.repository.PedidoCompraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoCompraService {

    private final PedidoCompraRepository pedidoCompraRepository;

    public List<PedidoCompraDTO> obtenerTodos() {
        return pedidoCompraRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PedidoCompraDTO> obtenerPorEmpresa(Integer idEmpresa) {
        return pedidoCompraRepository.findByEmpresa(idEmpresa).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PedidoCompraDTO> obtenerPorProveedor(Integer idProveedor) {
        return pedidoCompraRepository.findByIdProveedor(idProveedor).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PedidoCompraDTO> obtenerPorEstado(String estado) {
        return pedidoCompraRepository.findByEstadoPedido(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PedidoCompraDTO obtenerPorId(Long id) {
        return pedidoCompraRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Pedido de compra no encontrado"));
    }

    public PedidoCompraDTO crear(PedidoCompraDTO dto) {
        PedidoCompra pedido = PedidoCompra.builder()
                .idProveedor(dto.getIdProveedor())
                .idUsuario(dto.getIdUsuario())
                .fechaPedido(dto.getFechaPedido() != null ? dto.getFechaPedido() : LocalDateTime.now())
                .fechaEntregaEsperada(dto.getFechaEntregaEsperada())
                .estadoPedido(dto.getEstadoPedido() != null ? dto.getEstadoPedido() : "Pendiente")
                .totalPedido(dto.getTotalPedido() != null ? dto.getTotalPedido() : BigDecimal.ZERO)
                .build();

        PedidoCompra saved = pedidoCompraRepository.save(pedido);
        return convertToDTO(saved);
    }

    public PedidoCompraDTO actualizar(Long id, PedidoCompraDTO dto) {
        PedidoCompra pedido = pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (dto.getTotalPedido() != null) {
            pedido.setTotalPedido(dto.getTotalPedido());
        }
        if (dto.getEstadoPedido() != null) {
            pedido.setEstadoPedido(dto.getEstadoPedido());
        }
        if (dto.getFechaEntregaEsperada() != null) {
            pedido.setFechaEntregaEsperada(dto.getFechaEntregaEsperada());
        }

        PedidoCompra updated = pedidoCompraRepository.save(pedido);
        return convertToDTO(updated);
    }

    public void eliminar(Long id) {
        pedidoCompraRepository.deleteById(id);
    }

    private PedidoCompraDTO convertToDTO(PedidoCompra pedido) {
        return PedidoCompraDTO.builder()
                .idPedidoCompra(pedido.getIdPedidoCompra())
                .idProveedor(pedido.getIdProveedor())
                .idUsuario(pedido.getIdUsuario())
                .fechaPedido(pedido.getFechaPedido())
                .fechaEntregaEsperada(pedido.getFechaEntregaEsperada())
                .estadoPedido(pedido.getEstadoPedido())
                .totalPedido(pedido.getTotalPedido())
                .build();
    }
}
