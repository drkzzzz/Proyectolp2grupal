package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.CategoriaProductoDTO;
import com.lp2.tapstyle.service.CategoriaProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaProductoService categoriaService;

    /**
     * GET /api/categorias
     * Obtener todas las categorías
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoriaProductoDTO>>> obtenerTodas() {
        try {
            List<CategoriaProductoDTO> categorias = categoriaService.obtenerTodas();
            return ResponseEntity.ok(ApiResponse.success(categorias, "Categorías cargadas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CategoriaError", "Error: " + e.getMessage()));
        }
    }

    /**
     * GET /api/categorias/{id}
     * Obtener una categoría específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoriaProductoDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            CategoriaProductoDTO categoria = categoriaService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(categoria, "Categoría encontrada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Categoría no encontrada"));
        }
    }

    /**
     * POST /api/categorias
     * Crear nueva categoría
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CategoriaProductoDTO>> crear(@RequestBody CategoriaProductoDTO dto) {
        try {
            CategoriaProductoDTO nueva = categoriaService.crear(dto);
            return ResponseEntity.ok(ApiResponse.success(nueva, "Categoría creada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", "Error al crear: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/categorias/{id}
     * Actualizar categoría
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoriaProductoDTO>> actualizar(
            @PathVariable Integer id,
            @RequestBody CategoriaProductoDTO dto) {
        try {
            CategoriaProductoDTO actualizada = categoriaService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(actualizada, "Categoría actualizada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", "Error: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/categorias/{id}
     * Eliminar categoría
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Integer id) {
        try {
            categoriaService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("", "Categoría eliminada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", "Error: " + e.getMessage()));
        }
    }
}
