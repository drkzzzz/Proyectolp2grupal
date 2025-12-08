package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CategoriaProductoDTO {
    private Integer idCategoria;
    private String nombreCategoria;
    private String descripcion;
}
