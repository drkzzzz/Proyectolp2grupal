package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.MetodoPagoDTO;
import com.lp2.tapstyle.service.MetodoPagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metodos-pago")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MetodoPagoController {

    private final MetodoPagoService metodoPagoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MetodoPagoDTO>>> obtenerTodos(
            @RequestParam(required = false) Integer idEmpresa) {
        try {
            // Si no envían idEmpresa, retornamos vacío para seguridad en multi-tenant
            if (idEmpresa == null) {
                return ResponseEntity.ok(ApiResponse.success(List.of(), "Se requiere idEmpresa"));
            }
            List<MetodoPagoDTO> metodos = metodoPagoService.obtenerTodos(idEmpresa);
            return ResponseEntity.ok(ApiResponse.success(metodos, "Métodos de pago obtenidos"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error", "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MetodoPagoDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            MetodoPagoDTO metodo = metodoPagoService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(metodo, "Método de pago encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("NotFound", "Error: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MetodoPagoDTO>> crear(@RequestBody MetodoPagoDTO dto,
            @RequestParam Integer idEmpresa) {
        try {
            MetodoPagoDTO creado = metodoPagoService.crear(dto, idEmpresa);
            return ResponseEntity.ok(ApiResponse.success(creado, "Método de pago creado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("CreationError", "Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MetodoPagoDTO>> actualizar(@PathVariable Integer id,
            @RequestBody MetodoPagoDTO dto) {
        try {
            MetodoPagoDTO actualizado = metodoPagoService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(actualizado, "Método de pago actualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("UpdateError", "Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Integer id) {
        try {
            metodoPagoService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Método de pago eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("DeleteError", "Error: " + e.getMessage()));
        }
    }
}
