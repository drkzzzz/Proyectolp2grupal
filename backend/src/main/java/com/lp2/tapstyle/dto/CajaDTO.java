package com.lp2.tapstyle.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CajaDTO {
    private Integer idCaja;
    private Integer idEmpresa;
    private String nombreCaja;
    private String ubicacion;
    private String estado;
    private BigDecimal montoInicial;
    private BigDecimal montoActual;
    private LocalDateTime fechaApertura;
    private LocalDateTime fechaCierre;
}
