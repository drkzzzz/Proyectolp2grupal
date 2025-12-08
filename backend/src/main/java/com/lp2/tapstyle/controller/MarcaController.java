package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.MarcaProductoDTO;
import com.lp2.tapstyle.service.MarcaProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarcaController {

    private final MarcaProductoService marcaService;

    /**
     * GET /api/marcas/empresa/{empresaId}
     * Obtener marcas de una empresa
     */
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<MarcaProductoDTO>>> obtenerPorEmpresa(
            @PathVariable Integer empresaId) {
        try {
            List<MarcaProductoDTO> marcas = marcaService.obtenerPorEmpresa(empresaId);
            return ResponseEntity.ok(ApiResponse.success(marcas, "Marcas cargadas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("MarcaError", "Error: " + e.getMessage()));
        }
    }

    /**
     * GET /api/marcas
     * Obtener todas las marcas
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MarcaProductoDTO>>> obtenerTodas() {
        try {
            List<MarcaProductoDTO> marcas = marcaService.obtenerTodas();
            return ResponseEntity.ok(ApiResponse.success(marcas, "Marcas cargadas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("MarcaError", "Error: " + e.getMessage()));
        }
    }

    /**
     * GET /api/marcas/{id}
     * Obtener una marca específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MarcaProductoDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            MarcaProductoDTO marca = marcaService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(marca, "Marca encontrada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Marca no encontrada"));
        }
    }

    /**
     * POST /api/marcas
     * Crear nueva marca
     */
    @PostMapping
    public ResponseEntity<ApiResponse<MarcaProductoDTO>> crear(@RequestBody MarcaProductoDTO dto) {
        try {
            MarcaProductoDTO nueva = marcaService.crear(dto);
            return ResponseEntity.ok(ApiResponse.success(nueva, "Marca creada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", "Error: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/marcas/{id}
     * Actualizar marca
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MarcaProductoDTO>> actualizar(
            @PathVariable Integer id,
            @RequestBody MarcaProductoDTO dto) {
        try {
            MarcaProductoDTO actualizada = marcaService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(actualizada, "Marca actualizada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", "Error: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/marcas/{id}
     * Eliminar marca
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Integer id) {
        try {
            marcaService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("", "Marca eliminada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", "Error: " + e.getMessage()));
        }
    }
}
