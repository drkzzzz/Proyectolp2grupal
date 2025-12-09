package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.CuentaFinancieraDTO;
import com.lp2.tapstyle.service.FinanzasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finanzas")
@CrossOrigin(origins = "*") // Allow frontend access
@RequiredArgsConstructor
public class FinanzasController {

    private final FinanzasService finanzasService;

    @GetMapping("/cuentas-por-pagar")
    public ResponseEntity<List<CuentaFinancieraDTO>> getCuentasPorPagar(@RequestParam Integer idEmpresa) {
        System.out.println("💰 API /cuentas-por-pagar solicitada para Empresa ID: " + idEmpresa);
        try {
            List<CuentaFinancieraDTO> cuentas = finanzasService.obtenerCuentasPorPagar(idEmpresa);
            System.out.println("✅ Se encontraron " + cuentas.size() + " cuentas por pagar.");
            return ResponseEntity.ok(cuentas);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Error en /cuentas-por-pagar: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/cuentas-por-cobrar")
    public ResponseEntity<List<CuentaFinancieraDTO>> getCuentasPorCobrar(@RequestParam Integer idEmpresa) {
        System.out.println("💰 API /cuentas-por-cobrar solicitada para Empresa ID: " + idEmpresa);
        try {
            List<CuentaFinancieraDTO> cuentas = finanzasService.obtenerCuentasPorCobrar(idEmpresa);
            System.out.println("✅ Se encontraron " + cuentas.size() + " cuentas por cobrar.");
            return ResponseEntity.ok(cuentas);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Error en /cuentas-por-cobrar: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/reporte")
    public ResponseEntity<com.lp2.tapstyle.dto.ReporteFinancieroDTO> getReporteFinanciero(
            @RequestParam Integer idEmpresa) {
        try {
            return ResponseEntity.ok(finanzasService.obtenerReporte(idEmpresa));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/pagar/{idFactura}")
    public ResponseEntity<?> pagarFactura(@PathVariable Long idFactura,
            @RequestBody java.util.Map<String, Object> payload) {
        try {
            Integer idEmpresa = (Integer) payload.get("idEmpresa");
            String metodoPago = (String) payload.getOrDefault("metodoPago", "Transferencia");
            finanzasService.registrarPagoSuscripcion(idEmpresa, idFactura, metodoPago);
            return ResponseEntity.ok(org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al procesar pago: " + e.getMessage());
        }
    }
}
