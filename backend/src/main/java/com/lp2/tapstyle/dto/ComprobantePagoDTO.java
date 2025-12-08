package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComprobantePagoDTO {

    private Long idComprobante;
    private Integer idEmpresa;
    private Integer idCliente;
    private Integer idUsuario;
    private Integer idTipoComprobante;
    private String numeroComprobante;
    private LocalDateTime fechaEmision;
    private BigDecimal total;
    private BigDecimal igv;
    private BigDecimal subtotal;
    private String estado;
    private String motivoAnulacion;
}
