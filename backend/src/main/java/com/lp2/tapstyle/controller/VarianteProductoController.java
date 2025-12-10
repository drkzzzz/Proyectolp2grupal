package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.model.VarianteProducto;
import com.lp2.tapstyle.repository.VarianteProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/variantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VarianteProductoController {

    private final VarianteProductoRepository varianteRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VarianteProducto>>> obtenerTodasVariantes() {
        try {
            List<VarianteProducto> variantes = varianteRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success(variantes, "Variantes obtenidas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<ApiResponse<List<VarianteProducto>>> obtenerVariantesPorProducto(
            @PathVariable Integer idProducto) {
        try {
            List<VarianteProducto> variantes = varianteRepository.findAll().stream()
                    .filter(v -> v.getProducto().getIdProducto().equals(idProducto))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success(variantes, "Variantes obtenidas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }

    @GetMapping("/{idVariante}")
    public ResponseEntity<ApiResponse<VarianteProducto>> obtenerVariante(@PathVariable Integer idVariante) {
        try {
            VarianteProducto variante = varianteRepository.findById(idVariante)
                    .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
            return ResponseEntity.ok(ApiResponse.success(variante, "Variante obtenida"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error", e.getMessage()));
        }
    }
}
