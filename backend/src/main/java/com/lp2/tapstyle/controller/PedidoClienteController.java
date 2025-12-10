package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.*;
import com.lp2.tapstyle.service.PedidoClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos-clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PedidoClienteController {

    private final PedidoClienteService pedidoService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<PedidoClienteDTO>> crearPedido(
            @RequestBody CheckoutRequest request) {
        try {
            PedidoClienteDTO pedido = pedidoService.crearPedidoDesdeCarrito(request);
            return ResponseEntity.ok(ApiResponse.success(pedido, "Pedido creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @PostMapping("/checkout-carrito")
    public ResponseEntity<ApiResponse<PedidoClienteDTO>> crearPedidoCarrito(
            @RequestBody CheckoutCarritoRequest request) {
        try {
            PedidoClienteDTO pedido = pedidoService.crearPedidoDesdeCarritoFrontend(request);
            return ResponseEntity.ok(ApiResponse.success(pedido, "Pedido creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<ApiResponse<List<PedidoClienteDTO>>> obtenerPedidosUsuario(
            @PathVariable Integer idUsuario) {
        try {
            List<PedidoClienteDTO> pedidos = pedidoService.obtenerPedidosPorUsuario(idUsuario);
            return ResponseEntity.ok(ApiResponse.success(pedidos, "Pedidos obtenidos"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @GetMapping("/empresa/{idEmpresa}")
    public ResponseEntity<ApiResponse<List<PedidoClienteDTO>>> obtenerPedidosEmpresa(
            @PathVariable Integer idEmpresa) {
        try {
            List<PedidoClienteDTO> pedidos = pedidoService.obtenerPedidosPorEmpresa(idEmpresa);
            return ResponseEntity.ok(ApiResponse.success(pedidos, "Pedidos obtenidos"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @GetMapping("/{idPedido}")
    public ResponseEntity<ApiResponse<PedidoClienteDTO>> obtenerPedido(@PathVariable Long idPedido) {
        try {
            PedidoClienteDTO pedido = pedidoService.obtenerPorId(idPedido);
            return ResponseEntity.ok(ApiResponse.success(pedido, "Pedido encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @PutMapping("/{idPedido}/estado")
    public ResponseEntity<ApiResponse<PedidoClienteDTO>> actualizarEstado(
            @PathVariable Long idPedido,
            @RequestParam String estado) {
        try {
            PedidoClienteDTO pedido = pedidoService.actualizarEstado(idPedido, estado);
            return ResponseEntity.ok(ApiResponse.success(pedido, "Estado actualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }
}
