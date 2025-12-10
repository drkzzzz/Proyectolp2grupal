package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.model.Permiso;
import com.lp2.tapstyle.service.PermisoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permisos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PermisoController {

    private final PermisoService permisoService;

    /**
     * Listar todos los permisos (ordenados)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Permiso>>> listar() {
        try {
            List<Permiso> permisos = permisoService.listarTodos();
            return ResponseEntity.ok(ApiResponse.success(permisos, "Permisos obtenidos exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("PermisoError", "Error al obtener permisos: " + e.getMessage()));
        }
    }

    /**
     * Obtener permiso por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Permiso>> obtenerPorId(@PathVariable Integer id) {
        try {
            Permiso permiso = permisoService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(permiso, "Permiso encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Permiso no encontrado: " + e.getMessage()));
        }
    }

    /**
     * Crear nuevo permiso
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Permiso>> crear(@RequestBody Permiso permiso) {
        try {
            if (permiso.getNombrePermiso() == null || permiso.getNombrePermiso().trim().isEmpty()) {
                throw new RuntimeException("El nombre del permiso es requerido");
            }

            Permiso permisoCreado = permisoService.crear(permiso);
            return ResponseEntity.ok(ApiResponse.success(permisoCreado, "Permiso creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", e.getMessage()));
        }
    }

    /**
     * Actualizar permiso
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Permiso>> actualizar(
            @PathVariable Integer id,
            @RequestBody Permiso permiso) {
        try {
            Permiso permisoActualizado = permisoService.actualizar(id, permiso);
            return ResponseEntity.ok(ApiResponse.success(permisoActualizado, "Permiso actualizado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", e.getMessage()));
        }
    }

    /**
     * Eliminar permiso
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Integer id) {
        try {
            permisoService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("", "Permiso eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", e.getMessage()));
        }
    }
}
