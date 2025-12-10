package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.ClienteDTO;
import com.lp2.tapstyle.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    /**
     * Listar clientes por empresa
     * 
     * @param idEmpresa   ID de la empresa
     * @param soloActivos Si se debe filtrar solo activos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClienteDTO>>> listar(
            @RequestParam Integer idEmpresa,
            @RequestParam(required = false, defaultValue = "false") Boolean soloActivos) {
        try {
            List<ClienteDTO> clientes = soloActivos
                    ? clienteService.listarActivosPorEmpresa(idEmpresa)
                    : clienteService.listarPorEmpresa(idEmpresa);
            return ResponseEntity.ok(ApiResponse.success(clientes, "Clientes obtenidos exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ClienteError", "Error al obtener clientes: " + e.getMessage()));
        }
    }

    /**
     * Obtener cliente por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            ClienteDTO cliente = clienteService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(cliente, "Cliente encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Cliente no encontrado: " + e.getMessage()));
        }
    }

    /**
     * Crear cliente manual desde admin
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ClienteDTO>> crear(@RequestBody ClienteDTO dto) {
        try {
            // Validar campos requeridos
            if (dto.getNombre() == null || dto.getNombre().isEmpty()) {
                throw new RuntimeException("El nombre es requerido");
            }
            if (dto.getApellido() == null || dto.getApellido().isEmpty()) {
                throw new RuntimeException("El apellido es requerido");
            }
            if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
                throw new RuntimeException("El email es requerido");
            }
            if (dto.getIdEmpresa() == null) {
                throw new RuntimeException("El ID de empresa es requerido");
            }

            ClienteDTO cliente = clienteService.crearManual(dto);
            return ResponseEntity.ok(ApiResponse.success(cliente, "Cliente creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", e.getMessage()));
        }
    }

    /**
     * Actualizar cliente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDTO>> actualizar(
            @PathVariable Integer id,
            @RequestBody ClienteDTO dto) {
        try {
            ClienteDTO cliente = clienteService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(cliente, "Cliente actualizado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", e.getMessage()));
        }
    }

    /**
     * Activar/Desactivar cliente
     */
    @PutMapping("/{id}/toggle-estado")
    public ResponseEntity<ApiResponse<ClienteDTO>> toggleEstado(@PathVariable Integer id) {
        try {
            ClienteDTO cliente = clienteService.toggleEstado(id);
            String mensaje = cliente.getEstado()
                    ? "Cliente activado exitosamente"
                    : "Cliente desactivado exitosamente";
            return ResponseEntity.ok(ApiResponse.success(cliente, mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ToggleError", e.getMessage()));
        }
    }

    /**
     * Eliminar cliente (NO RECOMENDADO - usar toggle estado)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Integer id) {
        try {
            clienteService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("", "Cliente eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DeleteError", "Error al eliminar cliente: " + e.getMessage()));
        }
    }
}
