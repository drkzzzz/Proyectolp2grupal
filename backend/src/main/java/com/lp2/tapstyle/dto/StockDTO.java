package com.lp2.tapstyle.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockDTO {
    private Integer idInventario;
    private Integer idVariante;
    private String codigoSKU;
    private String nombreProducto;
    private String talla;
    private String color;
    private Integer idAlmacen;
    private String nombreAlmacen;
    private Integer cantidadStock;
    private Integer stockMinimo;
    private String estadoStock;
    private java.time.LocalDateTime fechaUltimaActualizacion;
}
