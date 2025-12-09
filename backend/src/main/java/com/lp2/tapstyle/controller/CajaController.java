package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.CajaDTO;
import com.lp2.tapstyle.service.CajaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cajas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CajaController {

    private final CajaService cajaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CajaDTO>>> obtenerTodas() {
        try {
            List<CajaDTO> cajas = cajaService.obtenerTodas();
            return ResponseEntity.ok(ApiResponse.success(cajas, "Cajas obtenidas exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("CajaError", "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<ApiResponse<List<CajaDTO>>> obtenerPorEmpresa(@PathVariable Integer empresaId) {
        try {
            List<CajaDTO> cajas = cajaService.obtenerPorEmpresa(empresaId);
            return ResponseEntity.ok(ApiResponse.success(cajas, "Cajas de empresa obtenidas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("CajaError", "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CajaDTO>> obtenerPorId(@PathVariable Integer id) {
        try {
            CajaDTO caja = cajaService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success(caja, "Caja encontrada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("NotFound", "Caja no encontrada"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CajaDTO>> crear(@RequestBody CajaDTO dto) {
        try {
            CajaDTO nuevaCaja = cajaService.crear(dto);
            return ResponseEntity.ok(ApiResponse.success(nuevaCaja, "Caja creada exitosamente"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("CreationError", "Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CajaDTO>> actualizar(@PathVariable Integer id, @RequestBody CajaDTO dto) {
        try {
            CajaDTO actualizada = cajaService.actualizar(id, dto);
            return ResponseEntity.ok(ApiResponse.success(actualizada, "Caja actualizada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("UpdateError", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/abrir")
    public ResponseEntity<ApiResponse<CajaDTO>> abrirCaja(@PathVariable Integer id, @RequestBody CajaDTO dto) {
        try {
            // Se asume que el DTO trae idUsuario y montoInicial
            CajaDTO abierta = cajaService.abrirCaja(id, dto.getMontoInicial(), dto.getIdUsuario());
            return ResponseEntity.ok(ApiResponse.success(abierta, "Caja abierta exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("OpenError", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/cerrar")
    public ResponseEntity<ApiResponse<CajaDTO>> cerrarCaja(@PathVariable Integer id, @RequestBody CajaDTO dto) {
        try {
            // Se asume que el DTO trae idUsuario, montoFinal y observaciones
            CajaDTO cerrada = cajaService.cerrarCaja(id, dto.getMontoFinal(), dto.getObservaciones(),
                    dto.getIdUsuario());
            return ResponseEntity.ok(ApiResponse.success(cerrada, "Caja cerrada exitosamente"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("CloseError", "Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Integer id) {
        try {
            cajaService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Caja eliminada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("DeleteError", "Error: " + e.getMessage()));
        }
    }
}
