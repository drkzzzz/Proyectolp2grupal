package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.MaterialProductoDTO;
import com.lp2.tapstyle.service.MaterialProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materiales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MaterialController {

    private final MaterialProductoService materialService;

    /**
     * GET /api/materiales
     * Obtener todos los materiales
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MaterialProductoDTO>>> obtenerTodos() {
        try {
            List<MaterialProductoDTO> materiales = materialService.obtenerTodos();
            return ResponseEntity.ok(ApiResponse.success(materiales, "Materiales cargados"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("MaterialError", "Error: " + e.getMessage()));
        }
    }

    /**
     * GET /api/materiales/{id}
     * Obtener un material específico
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaterialProductoDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            MaterialProductoDTO material = materialService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(material, "Material encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Material no encontrado"));
        }
    }

    /**
     * POST /api/materiales
     * Crear nuevo material
     */
    @PostMapping
    public ResponseEntity<ApiResponse<MaterialProductoDTO>> crear(@RequestBody MaterialProductoDTO dto) {
        try {
            MaterialProductoDTO nuevo = materialService.crear(dto);
            return ResponseEntity.ok(ApiResponse.success(nuevo, "Material creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", "Error: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/materiales/{id}
     * Actualizar material
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MaterialProductoDTO>> actualizar(
            @PathVariable Integer id,
            @RequestBody MaterialProductoDTO dto) {
        try {
            MaterialProductoDTO actualizado = materialService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(actualizado, "Material actualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", "Error: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/materiales/{id}
     * Eliminar material
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Integer id) {
        try {
            materialService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("", "Material eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", "Error: " + e.getMessage()));
        }
    }
}
