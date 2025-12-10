package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DetallePedidoClienteDTO {
    private Long idDetalle;
    private Long idPedido;
    private Integer idVariante;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotalLinea;
    
    // Información adicional para mostrar
    private String nombreProducto;
    private String nombreVariante;
    private String imagenUrl;
}
