package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.AjusteStockRequest;
import com.lp2.tapstyle.dto.InventarioDTO;
import com.lp2.tapstyle.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventarioController {

    private final InventarioService inventarioService;

    @GetMapping
    public ResponseEntity<List<InventarioDTO>> obtenerTodos() {
        return ResponseEntity.ok(inventarioService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(inventarioService.obtenerPorId(id));
    }

    @GetMapping("/almacen/{almacenId}")
    public ResponseEntity<List<InventarioDTO>> obtenerPorAlmacen(@PathVariable Integer almacenId) {
        return ResponseEntity.ok(inventarioService.obtenerPorAlmacen(almacenId));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<InventarioDTO>> obtenerPorEmpresa(@PathVariable Integer empresaId) {
        return ResponseEntity.ok(inventarioService.obtenerPorEmpresa(empresaId));
    }

    @GetMapping("/bajo-stock")
    public ResponseEntity<List<InventarioDTO>> obtenerProductosBajoStock() {
        return ResponseEntity.ok(inventarioService.obtenerProductosBajoStock());
    }

    @PostMapping
    public ResponseEntity<InventarioDTO> crear(@RequestBody InventarioDTO dto) {
        return ResponseEntity.ok(inventarioService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioDTO> actualizar(@PathVariable Integer id, @RequestBody InventarioDTO dto) {
        return ResponseEntity.ok(inventarioService.actualizar(id, dto));
    }

    @PostMapping("/{id}/ajustar")
    public ResponseEntity<Void> ajustarStock(
            @PathVariable Integer id,
            @RequestParam Integer cantidad,
            @RequestParam String tipo) {
        inventarioService.ajustarStock(id, cantidad, tipo);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/registrar-ajuste")
    public ResponseEntity<String> registrarAjuste(@RequestBody AjusteStockRequest request) {
        try {
            inventarioService.ajustarStockPorProducto(request.getIdProducto(), request.getCantidad(),
                    request.getTipo());
            return ResponseEntity.ok("Ajuste guardado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al guardar ajuste: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        inventarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
