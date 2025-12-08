package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.model.TipoComprobante;
import com.lp2.tapstyle.repository.TipoComprobanteRepository;
import com.lp2.tapstyle.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-comprobante")
@RequiredArgsConstructor
public class TipoComprobanteController {

    private final TipoComprobanteRepository tipoComprobanteRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoComprobante>>> obtenerTodos() {
        try {
            List<TipoComprobante> tipos = tipoComprobanteRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success(tipos, "Tipos de comprobante obtenidos correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", "Error al obtener tipos de comprobante: " + e.getMessage()));
        }
    }
}
