package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.MovimientoCajaDTO;
import com.lp2.tapstyle.service.MovimientoCajaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos-caja")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MovimientoCajaController {

    private final MovimientoCajaService movimientoCajaService;

    @GetMapping
    public ResponseEntity<List<MovimientoCajaDTO>> obtenerTodos() {
        return ResponseEntity.ok(movimientoCajaService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoCajaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(movimientoCajaService.obtenerPorId(id));
    }

    @GetMapping("/caja/{idCaja}")
    public ResponseEntity<List<MovimientoCajaDTO>> obtenerPorCaja(@PathVariable Integer idCaja) {
        return ResponseEntity.ok(movimientoCajaService.obtenerPorCaja(idCaja));
    }

    @GetMapping("/tipo/{tipoMovimiento}")
    public ResponseEntity<List<MovimientoCajaDTO>> obtenerPorTipo(@PathVariable String tipoMovimiento) {
        return ResponseEntity.ok(movimientoCajaService.obtenerPorTipo(tipoMovimiento));
    }

    @PostMapping
    public ResponseEntity<MovimientoCajaDTO> crear(@RequestBody MovimientoCajaDTO dto) {
        return ResponseEntity.ok(movimientoCajaService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovimientoCajaDTO> actualizar(@PathVariable Long id, @RequestBody MovimientoCajaDTO dto) {
        return ResponseEntity.ok(movimientoCajaService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        movimientoCajaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
