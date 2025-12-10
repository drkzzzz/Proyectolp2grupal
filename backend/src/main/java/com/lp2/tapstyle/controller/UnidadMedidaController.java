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
     * GET /api/unidades-medida/empresa/{empresaId}
     * Obtener unidades de medida de una empresa específica
     */
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<UnidadMedidaDTO>>> obtenerPorEmpresa(@PathVariable Integer empresaId) {
        try {
            List<UnidadMedidaDTO> unidades = unidadService.obtenerPorEmpresa(empresaId);
            return ResponseEntity.ok(ApiResponse.success(unidades, "Unidades de empresa cargadas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("EmpresaError", "Error: " + e.getMessage()));
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

    /**
     * POST /api/unidades-medida
     * Crear nueva unidad de medida
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UnidadMedidaDTO>> crear(@RequestBody UnidadMedidaDTO dto) {
        try {
            UnidadMedidaDTO nuevo = unidadService.crear(dto);
            return ResponseEntity.ok(ApiResponse.success(nuevo, "Unidad creada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", "Error: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/unidades-medida/{id}
     * Actualizar unidad de medida
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UnidadMedidaDTO>> actualizar(
            @PathVariable Integer id,
            @RequestBody UnidadMedidaDTO dto) {
        try {
            UnidadMedidaDTO actualizado = unidadService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(actualizado, "Unidad actualizada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", "Error: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/unidades-medida/{id}
     * Eliminar unidad de medida
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Integer id) {
        try {
            unidadService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("", "Unidad eliminada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", "Error: " + e.getMessage()));
        }
    }
}
