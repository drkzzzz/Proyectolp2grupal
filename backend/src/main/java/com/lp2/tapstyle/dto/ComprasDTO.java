package com.lp2.tapstyle.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprasDTO {
    private Long idPedidoCompra;
    private Integer idProveedor;
    private String nombreProveedor;
    private Integer idUsuario;
    private String nombreUsuario;
    private LocalDateTime fechaPedido;
    private LocalDateTime fechaEntregaEsperada;
    private String estadoPedido;
    private BigDecimal totalPedido;
    private Integer cantidadItems;
}
