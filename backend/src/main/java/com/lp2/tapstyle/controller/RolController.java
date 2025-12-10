package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.model.Rol;
import com.lp2.tapstyle.model.Permiso;
import com.lp2.tapstyle.service.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RolController {

    private final RolService rolService;

    /**
     * Listar todos los roles
     * 
     * @param soloActivos Si es true, solo devuelve roles activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Rol>>> listar(
            @RequestParam(required = false, defaultValue = "false") Boolean soloActivos) {
        try {
            List<Rol> roles = soloActivos ? rolService.obtenerActivos() : rolService.obtenerTodos();
            return ResponseEntity.ok(ApiResponse.success(roles, "Roles obtenidos exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("RolError", "Error al obtener roles: " + e.getMessage()));
        }
    }

    /**
     * Obtener rol por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Rol>> obtenerPorId(@PathVariable Integer id) {
        try {
            Rol rol = rolService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(rol, "Rol encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Rol no encontrado: " + e.getMessage()));
        }
    }

    /**
     * Crear nuevo rol
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Rol>> crear(@RequestBody Rol rol) {
        try {
            // Validar campos requeridos
            if (rol.getNombreRol() == null || rol.getNombreRol().trim().isEmpty()) {
                throw new RuntimeException("El nombre del rol es requerido");
            }

            Rol rolCreado = rolService.crear(rol);
            return ResponseEntity.ok(ApiResponse.success(rolCreado, "Rol creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", e.getMessage()));
        }
    }

    /**
     * Actualizar rol
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Rol>> actualizar(
            @PathVariable Integer id,
            @RequestBody Rol rol) {
        try {
            Rol rolActualizado = rolService.actualizar(id, rol);
            return ResponseEntity.ok(ApiResponse.success(rolActualizado, "Rol actualizado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", e.getMessage()));
        }
    }

    /**
     * Activar/Desactivar rol
     */
    @PutMapping("/{id}/toggle-estado")
    public ResponseEntity<ApiResponse<Rol>> toggleEstado(@PathVariable Integer id) {
        try {
            Rol rol = rolService.toggleEstado(id);
            String mensaje = rol.getEstado()
                    ? "Rol activado exitosamente"
                    : "Rol desactivado exitosamente";
            return ResponseEntity.ok(ApiResponse.success(rol, mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ToggleError", e.getMessage()));
        }
    }

    /**
     * Asignar permisos a un rol
     */
    @PutMapping("/{id}/permisos")
    public ResponseEntity<ApiResponse<Rol>> asignarPermisos(
            @PathVariable Integer id,
            @RequestBody Set<Permiso> permisos) {
        try {
            Rol rol = rolService.asignarPermisos(id, permisos);
            return ResponseEntity.ok(ApiResponse.success(rol, "Permisos asignados exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("AssignError", e.getMessage()));
        }
    }

    /**
     * Obtener permisos de un rol
     */
    @GetMapping("/{id}/permisos")
    public ResponseEntity<ApiResponse<Set<Permiso>>> obtenerPermisos(@PathVariable Integer id) {
        try {
            Set<Permiso> permisos = rolService.obtenerPermisos(id);
            return ResponseEntity.ok(ApiResponse.success(permisos, "Permisos obtenidos exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("PermisosError", e.getMessage()));
        }
    }

    /**
     * Eliminar rol (NO RECOMENDADO - usar toggle estado)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Integer id) {
        try {
            rolService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("", "Rol eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", e.getMessage()));
        }
    }
}
