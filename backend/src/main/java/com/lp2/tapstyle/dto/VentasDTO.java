package com.lp2.tapstyle.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentasDTO {
    private Long idComprobante;
    private Integer idEmpresa;
    private Long idCliente;
    private String nombreCliente;
    private Integer idUsuario;
    private String nombreUsuario;
    private Integer idTipoComprobante;
    private String tipoComprobante;
    private String numeroComprobante;
    private LocalDateTime fechaEmision;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String estado;
    private Integer cantidadItems;
}
