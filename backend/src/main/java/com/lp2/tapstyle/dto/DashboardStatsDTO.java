package com.lp2.tapstyle.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DashboardStatsDTO {
    private BigDecimal ventasDelMes;
    private Long comprasPendientes;
    private Long stockBajo;
    private BigDecimal cajaDisponible;
    private List<VentaRecenteDTO> ultimasVentas;
    private List<ProductoTopDTO> topProductos;
}
