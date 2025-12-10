package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PagoPedidoDTO {
    private Long idPagoPedido;
    private Long idPedido;
    private Integer idTipoPago;
    private String nombreTipoPago;
    private BigDecimal montoPagado;
    private LocalDateTime fechaPago;
    private String referenciaPago;
    private String estadoPago;
}
