package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductoTopDTO {
    private Long idProducto;
    private String nombreProducto;
    private Long cantidadVentas;
}
