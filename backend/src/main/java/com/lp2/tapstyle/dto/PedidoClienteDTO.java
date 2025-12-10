package com.lp2.tapstyle.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PedidoClienteDTO {
    private Long idPedido;
    private String numeroPedido;
    private Integer idUsuario;
    private Integer idEmpresa;
    private Integer idCliente;
    private LocalDateTime fechaPedido;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String estado;
    private String direccionEnvio;
    private String telefonoContacto;
    private String notas;
    private List<DetallePedidoClienteDTO> detalles;
    private List<PagoPedidoDTO> pagos;
}
