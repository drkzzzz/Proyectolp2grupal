package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.ProveedorDTO;
import com.lp2.tapstyle.service.ProveedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProveedorController {

    private final ProveedorService proveedorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProveedorDTO>>> obtenerTodos() {
        try {
            List<ProveedorDTO> proveedores = proveedorService.obtenerTodos();
            return ResponseEntity.ok(ApiResponse.success(proveedores, "Proveedores obtenidos"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("ProveedorError", "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProveedorDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            ProveedorDTO proveedor = proveedorService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(proveedor, "Proveedor encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("NotFound", "Proveedor no encontrado"));
        }
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<ProveedorDTO>>> obtenerPorEmpresa(@PathVariable Integer empresaId) {
        try {
            System.out.println("📋 Buscando proveedores para empresa: " + empresaId);
            List<ProveedorDTO> proveedores = proveedorService.obtenerPorEmpresa(empresaId);
            System.out.println("✅ Proveedores encontrados: " + proveedores.size());
            return ResponseEntity.ok(ApiResponse.success(proveedores, "Proveedores obtenidos"));
        } catch (Exception e) {
            System.out.println("❌ Error en obtenerPorEmpresa: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error interno", "Error: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProveedorDTO>> crear(@RequestBody ProveedorDTO dto) {
        try {
            ProveedorDTO nuevoProveedor = proveedorService.crear(dto);
            return ResponseEntity.ok(ApiResponse.success(nuevoProveedor, "Proveedor creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", "Error al crear: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProveedorDTO>> actualizar(@PathVariable Integer id,
            @RequestBody ProveedorDTO dto) {
        try {
            ProveedorDTO actualizado = proveedorService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(actualizado, "Proveedor actualizado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", "Error al actualizar: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Integer id) {
        try {
            proveedorService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Proveedor eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", "Error al eliminar: " + e.getMessage()));
        }
    }
}
