package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoCompraDTO {

    private Long idPedidoCompra;
    private Integer idProveedor;
    private String nombreProveedor;
    private Integer idUsuario;
    private LocalDateTime fechaPedido;
    private LocalDate fechaEntregaEsperada;
    private String estadoPedido;
    private BigDecimal totalPedido;
}
