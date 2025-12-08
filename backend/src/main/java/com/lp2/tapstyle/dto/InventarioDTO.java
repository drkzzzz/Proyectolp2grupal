package com.lp2.tapstyle.dto;

import lombok.*;
import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class InventarioDTO {
    private Integer idInventario;
    private Integer idProducto;
    private String nombreProducto;
    private Integer idVariante;
    private Integer idAlmacen;
    private String nombreAlmacen;
    private Integer cantidadStock;
    private Integer stockMinimo;
    private BigDecimal precioUnitario;
    private String fechaUltimaActualizacion;
}
