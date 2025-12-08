package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.PedidoCompraDTO;
import com.lp2.tapstyle.service.PedidoCompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos-compra")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PedidoCompraController {

    private final PedidoCompraService pedidoCompraService;

    @GetMapping
    public ResponseEntity<List<PedidoCompraDTO>> obtenerTodos() {
        return ResponseEntity.ok(pedidoCompraService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoCompraDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoCompraService.obtenerPorId(id));
    }

    @GetMapping("/empresa/{idEmpresa}")
    public ResponseEntity<List<PedidoCompraDTO>> obtenerPorEmpresa(@PathVariable Integer idEmpresa) {
        return ResponseEntity.ok(pedidoCompraService.obtenerPorEmpresa(idEmpresa));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<PedidoCompraDTO>> obtenerPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(pedidoCompraService.obtenerPorEstado(estado));
    }

    @PostMapping
    public ResponseEntity<PedidoCompraDTO> crear(@RequestBody PedidoCompraDTO dto) {
        return ResponseEntity.ok(pedidoCompraService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoCompraDTO> actualizar(@PathVariable Long id, @RequestBody PedidoCompraDTO dto) {
        return ResponseEntity.ok(pedidoCompraService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoCompraService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
