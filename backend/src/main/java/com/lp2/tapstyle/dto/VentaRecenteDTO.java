package com.lp2.tapstyle.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class VentaRecenteDTO {
    private Long idComprobante;
    private String numeroComprobante;
    private String clienteNombre;
    private BigDecimal monto;
    private LocalDateTime fecha;
}
