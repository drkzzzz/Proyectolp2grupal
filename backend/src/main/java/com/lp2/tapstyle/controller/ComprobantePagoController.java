package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ComprobantePagoDTO;
import com.lp2.tapstyle.service.ComprobantePagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comprobantes-pago")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComprobantePagoController {

    private final ComprobantePagoService comprobantePagoService;

    @GetMapping
    public ResponseEntity<List<ComprobantePagoDTO>> obtenerTodos() {
        return ResponseEntity.ok(comprobantePagoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComprobantePagoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(comprobantePagoService.obtenerPorId(id));
    }

    @GetMapping("/empresa/{idEmpresa}")
    public ResponseEntity<List<ComprobantePagoDTO>> obtenerPorEmpresa(@PathVariable Integer idEmpresa) {
        return ResponseEntity.ok(comprobantePagoService.obtenerPorEmpresa(idEmpresa));
    }

    @GetMapping("/estado-pago/{estadoPago}")
    public ResponseEntity<List<ComprobantePagoDTO>> obtenerPorEstadoPago(@PathVariable String estadoPago) {
        return ResponseEntity.ok(comprobantePagoService.obtenerPorEstado(estadoPago));
    }

    @PostMapping
    public ResponseEntity<ComprobantePagoDTO> crear(@RequestBody ComprobantePagoDTO dto) {
        return ResponseEntity.ok(comprobantePagoService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComprobantePagoDTO> actualizar(@PathVariable Long id, @RequestBody ComprobantePagoDTO dto) {
        return ResponseEntity.ok(comprobantePagoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        comprobantePagoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
