package com.lp2.tapstyle.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialProductoDTO {
    private Integer idMaterial;
    private Integer idEmpresa;
    private String nombreMaterial;
}
