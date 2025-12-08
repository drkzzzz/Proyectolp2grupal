package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoCajaDTO {

    private Long idMovimientoCaja;
    private Integer idCaja;
    private String nombreCaja;
    private Integer idUsuario;
    private String nombreUsuario;
    private String tipoMovimiento;
    private BigDecimal monto;
    private String descripcion;
    private LocalDateTime fechaMovimiento;
    private Long idComprobante;
}
