package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UnidadMedidaDTO {
    private Integer idUnidadMedida;
    private String nombreUnidad;
    private String abreviatura;
}
