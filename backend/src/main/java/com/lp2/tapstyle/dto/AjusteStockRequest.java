package com.lp2.tapstyle.dto;

import lombok.Data;

@Data
public class AjusteStockRequest {
    private Integer idProducto;
    private Integer cantidad;
    private String tipo;
    private String razon;
}
