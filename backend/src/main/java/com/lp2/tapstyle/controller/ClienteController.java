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

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClienteDTO>>> obtenerTodos() {
        try {
            List<ClienteDTO> clientes = clienteService.obtenerTodos();
            return ResponseEntity.ok(ApiResponse.success(clientes, "Clientes obtenidos exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ClienteError", "Error al obtener clientes: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            ClienteDTO cliente = clienteService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(cliente, "Cliente encontrado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("NotFound", "Cliente no encontrado"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClienteDTO>> crear(@RequestBody ClienteDTO dto) {
        try {
            ClienteDTO cliente = clienteService.crear(dto);
            return ResponseEntity.ok(ApiResponse.success(cliente, "Cliente creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("CreationError", "Error al crear cliente: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDTO>> actualizar(@PathVariable Integer id, @RequestBody ClienteDTO dto) {
        try {
            ClienteDTO cliente = clienteService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(cliente, "Cliente actualizado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("UpdateError", "Error al actualizar cliente: " + e.getMessage()));
        }
    }

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
