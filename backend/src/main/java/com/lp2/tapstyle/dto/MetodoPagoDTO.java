package com.lp2.tapstyle.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetodoPagoDTO {
    private Integer idTipoPago;
    private String tipoPago;
    private Boolean activo;
}
