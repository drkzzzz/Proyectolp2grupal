package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CarritoDTO {
    private Integer idCarrito;
    private Integer idUsuario;
    private Integer idEmpresa;
    private String estado;
    private List<ItemCarritoDTO> items;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private Integer cantidadTotal;
}
