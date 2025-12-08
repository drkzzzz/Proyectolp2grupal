package com.lp2.tapstyle.controller;

import com.lp2.tapstyle.dto.ApiResponse;
import com.lp2.tapstyle.dto.DashboardStatsDTO;
import com.lp2.tapstyle.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Obtener estadísticas del dashboard para una empresa
     * GET /api/dashboard/stats/{idEmpresa}
     */
    @GetMapping("/stats/{idEmpresa}")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> obtenerEstadisticas(
            @PathVariable Integer idEmpresa) {
        try {
            System.out.println("📊 Obteniendo estadísticas para empresa: " + idEmpresa);
            DashboardStatsDTO stats = dashboardService.obtenerEstadisticas(idEmpresa);
            System.out.println("✅ Estadísticas obtenidas: " + stats);
            return ResponseEntity.ok(ApiResponse.success(stats, "Estadísticas cargadas exitosamente"));
        } catch (Exception e) {
            System.err.println("❌ Error al cargar estadísticas: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("DashboardError", "Error al cargar estadísticas: " + e.getMessage()));
        }
    }
}
