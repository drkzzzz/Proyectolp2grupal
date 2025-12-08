package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallesPedidoCompraDTO {

    private Long idDetallePedido;
    private Long idPedidoCompra;
    private Integer idVariante;
    private String nombreVariante;
    private Integer cantidadSolicitada;
    private Integer cantidadRecibida;
    private BigDecimal precioUnitario;
}
