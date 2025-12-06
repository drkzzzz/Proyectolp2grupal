package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.SuscripcionEmpresaDTO;
import com.lp2.tapstyle.service.SuscripcionEmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suscripciones")
@CrossOrigin(origins = "*")
public class SuscripcionEmpresaController {

    @Autowired
    private SuscripcionEmpresaService suscripcionService;

    @GetMapping
    public List<SuscripcionEmpresaDTO> listarSuscripciones() {
        return suscripcionService.listarTodas();
    }

    @PostMapping("/generar")
    public ResponseEntity<?> generarSuscripcion(@RequestBody Map<String, Object> payload) {
        try {
            // Manejar conversion segura de Integer
            Object idObj = payload.get("idEmpresa");
            Integer idEmpresa = null;
            if (idObj instanceof Number) {
                idEmpresa = ((Number) idObj).intValue();
            } else {
                return ResponseEntity.badRequest().body("ID de empresa inválido");
            }

            SuscripcionEmpresaDTO nuevaSuscripcion = suscripcionService.crearSuscripcion(idEmpresa);
            return ResponseEntity.ok(nuevaSuscripcion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id,
            @RequestBody com.lp2.tapstyle.dto.EstadoUpdateDTO payload) {
        String estado = payload.getEstado();
        if (estado == null) {
            return ResponseEntity.badRequest().body("Estado requerido");
        }
        try {
            return ResponseEntity.ok(suscripcionService.actualizarEstado(id, estado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
