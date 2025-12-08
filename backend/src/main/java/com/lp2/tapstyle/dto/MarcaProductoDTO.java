package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MarcaProductoDTO {
    private Integer idMarca;
    private Integer idEmpresa;
    private String nombreMarca;
}
