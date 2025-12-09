package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.AjusteStockRequest;
import com.lp2.tapstyle.dto.InventarioDTO;
import com.lp2.tapstyle.dto.ApiResponse;
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
    public ResponseEntity<?> registrarAjuste(@RequestBody AjusteStockRequest request) {
        try {
            if (request.getIdProducto() == null || request.getCantidad() == null || request.getTipo() == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(false, "Campos requeridos: idProducto, cantidad, tipo", null, null));
            }

            inventarioService.ajustarStockPorProducto(request.getIdProducto(), request.getCantidad(),
                    request.getTipo());
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Ajuste guardado exitosamente", null, null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(
                    new ApiResponse<>(false, e.getMessage(), null, null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse<>(false, "Error al guardar ajuste: " + e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        inventarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/limpiar/huerfanos")
    public ResponseEntity<?> limpiarInventarioHuerfano() {
        try {
            int eliminados = inventarioService.limpiarInventarioHuerfano();
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Se eliminaron " + eliminados + " registros huérfanos", eliminados, null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse<>(false, "Error al limpiar inventario: " + e.getMessage(), null, null));
        }
    }
}
