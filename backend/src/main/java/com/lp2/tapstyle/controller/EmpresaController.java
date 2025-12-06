package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.CrearEmpresaConAdminRequest;
import com.lp2.tapstyle.dto.EmpresaDTO;
import com.lp2.tapstyle.service.EmpresaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmpresaController {

    private final EmpresaService empresaService;

    @GetMapping
    public ResponseEntity<List<EmpresaDTO>> obtenerTodas() {
        return ResponseEntity.ok(empresaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(empresaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<EmpresaDTO> crear(@RequestBody EmpresaDTO dto) {
        return ResponseEntity.ok(empresaService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaDTO> actualizar(@PathVariable Integer id, @RequestBody EmpresaDTO dto) {
        return ResponseEntity.ok(empresaService.actualizar(id, dto));
    }

    /**
     * Crear empresa junto con su usuario administrador
     */
    @PostMapping("/crear-con-admin")
    public ResponseEntity<EmpresaDTO> crearEmpresaConAdministrador(@RequestBody CrearEmpresaConAdminRequest request) {
        try {
            EmpresaDTO empresaCreada = empresaService.crearEmpresaConAdministrador(request);
            return ResponseEntity.ok(empresaCreada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener empresas por estado de aprobación
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<EmpresaDTO>> obtenerPorEstado(@PathVariable Boolean estado) {
        return ResponseEntity.ok(empresaService.obtenerPorEstado(estado));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Integer id, @RequestParam Boolean activo) {
        empresaService.cambiarEstado(id, activo);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/modulos")
    public ResponseEntity<Void> actualizarModulos(@PathVariable Integer id, @RequestParam String modulos) {
        empresaService.actualizarModulos(id, modulos);
        return ResponseEntity.ok().build();
    }
}
