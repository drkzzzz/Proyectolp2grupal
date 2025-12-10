package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ItemCarritoDTO {
    private Long idItemCarrito;
    private Integer idCarrito;
    private Integer idVariante;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private LocalDateTime fechaAgregado;
    
    // Información del producto para mostrar en el frontend
    private String nombreProducto;
    private String nombreVariante;
    private String imagenUrl;
    private Integer stockDisponible;
}
