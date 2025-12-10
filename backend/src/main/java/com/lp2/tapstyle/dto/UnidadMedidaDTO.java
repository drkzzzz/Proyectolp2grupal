package com.lp2.tapstyle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnidadMedidaDTO {
    private Integer idUnidadMedida;
    private Integer idEmpresa;
    private String nombreUnidad;
    private String abreviatura;
}
