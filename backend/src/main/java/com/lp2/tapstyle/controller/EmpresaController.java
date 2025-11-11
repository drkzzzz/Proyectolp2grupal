package com.lp2.tapstyle.controller;

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        empresaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
