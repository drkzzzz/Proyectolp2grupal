package com.lp2.tapstyle.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class InventarioDTO {
    private Integer idInventario;
    private Integer idVariante;
    private Integer idAlmacen;
    private Integer cantidadStock;
    private Integer stockMinimo;
    private String fechaUltimaActualizacion;
}
