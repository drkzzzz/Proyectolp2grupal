package com.lp2.tapstyle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReporteFinancieroDTO {
    private BigDecimal ingresosMes;
    private BigDecimal gastosMes;
    private BigDecimal totalPorCobrar;
    private BigDecimal totalPorPagar;
}
