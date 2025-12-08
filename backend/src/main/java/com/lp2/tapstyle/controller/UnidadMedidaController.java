package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.UnidadMedidaDTO;
import com.lp2.tapstyle.service.UnidadMedidaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades-medida")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UnidadMedidaController {

    private final UnidadMedidaService unidadService;

    /**
     * GET /api/unidades-medida
     * Obtener todas las unidades de medida
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UnidadMedidaDTO>>> obtenerTodas() {
        try {
            List<UnidadMedidaDTO> unidades = unidadService.obtenerTodas();
            return ResponseEntity.ok(ApiResponse.success(unidades, "Unidades cargadas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UnidadError", "Error: " + e.getMessage()));
        }
    }

    /**
     * GET /api/unidades-medida/{id}
     * Obtener una unidad específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UnidadMedidaDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            UnidadMedidaDTO unidad = unidadService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(unidad, "Unidad encontrada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Unidad no encontrada"));
        }
    }
}
